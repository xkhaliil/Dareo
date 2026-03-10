import { Router, type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../db.js";
import { computeLevel, computeRank } from "../../src/lib/xp.js";
import type { Rank } from "../../generated/prisma/enums.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;

// ─── XP helper ───────────────────────────────────────────

async function updateUserXp(userId: string, delta: number) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { xp: true } });
  if (!user) return null;
  const newXp = Math.max(0, user.xp + delta);
  return prisma.user.update({
    where: { id: userId },
    data: { xp: newXp, level: computeLevel(newXp), rank: computeRank(newXp) as Rank },
  });
}

// ─── Auth Middleware ─────────────────────────────────────

interface AuthRequest extends Request {
  userId?: string;
}

function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET!) as { userId: string };
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ─── Create Group ────────────────────────────────────────

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      res.status(400).json({ error: "Group name must be at least 2 characters" });
      return;
    }

    const code = crypto.randomBytes(4).toString("hex").toUpperCase();

    const group = await prisma.group.create({
      data: {
        name: name.trim(),
        code,
        members: {
          create: {
            userId: req.userId!,
            role: "OWNER",
          },
        },
      },
      include: {
        members: {
          include: { user: { select: { id: true, username: true, avatarUrl: true } } },
        },
      },
    });

    res.status(201).json(group);
  } catch (error) {
    console.error("Create group error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Join Group by Code ──────────────────────────────────

router.post("/join", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { code } = req.body;

    if (!code || typeof code !== "string") {
      res.status(400).json({ error: "Group code is required" });
      return;
    }

    const group = await prisma.group.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!group) {
      res.status(404).json({ error: "No group found with this code" });
      return;
    }

    const existing = await prisma.groupMember.findUnique({
      where: { userId_groupId: { userId: req.userId!, groupId: group.id } },
    });

    if (existing) {
      res.status(409).json({ error: "You are already a member of this group" });
      return;
    }

    await prisma.groupMember.create({
      data: {
        userId: req.userId!,
        groupId: group.id,
        role: "MEMBER",
      },
    });

    const updated = await prisma.group.findUnique({
      where: { id: group.id },
      include: {
        members: {
          include: { user: { select: { id: true, username: true, avatarUrl: true } } },
        },
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Join group error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── List My Groups ──────────────────────────────────────

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const memberships = await prisma.groupMember.findMany({
      where: { userId: req.userId },
      include: {
        group: {
          include: {
            members: {
              include: { user: { select: { id: true, username: true, avatarUrl: true } } },
            },
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    });

    res.json(memberships.map((m) => ({ ...m.group, myRole: m.role })));
  } catch (error) {
    console.error("List groups error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Get Single Group ────────────────────────────────────

router.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const groupId = req.params.id as string;
    const membership = await prisma.groupMember.findUnique({
      where: { userId_groupId: { userId: req.userId!, groupId } },
    });

    if (!membership) {
      res.status(403).json({ error: "You are not a member of this group" });
      return;
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: { user: { select: { id: true, username: true, avatarUrl: true, rank: true, level: true } } },
          orderBy: { joinedAt: "asc" },
        },
        dares: {
          include: {
            author: { select: { id: true, username: true, avatarUrl: true } },
            assignedTo: { select: { id: true, username: true, avatarUrl: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!group) {
      res.status(404).json({ error: "Group not found" });
      return;
    }

    res.json({ ...group, myRole: membership.role });
  } catch (error) {
    console.error("Get group error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Create Dare in Group ────────────────────────────────

router.post("/:id/dares", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const groupId = req.params.id as string;
    const { title, description, difficulty, xpReward } = req.body;

    if (!title || !description) {
      res.status(400).json({ error: "Title and description are required" });
      return;
    }

    const validDifficulties = ["EASY", "MEDIUM", "HARD", "EXTREME"];
    const diff = validDifficulties.includes(difficulty) ? difficulty : "EASY";

    // XP caps per difficulty
    const xpCaps: Record<string, number> = { EASY: 25, MEDIUM: 50, HARD: 100, EXTREME: 200 };
    const cap = xpCaps[diff] ?? 25;
    const clampedXp = Math.min(Math.max(typeof xpReward === "number" ? xpReward : 10, 1), cap);

    // Verify membership
    const membership = await prisma.groupMember.findUnique({
      where: { userId_groupId: { userId: req.userId!, groupId } },
    });

    if (!membership) {
      res.status(403).json({ error: "You are not a member of this group" });
      return;
    }

    const dare = await prisma.dare.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        difficulty: diff,
        xpReward: clampedXp,
        authorId: req.userId!,
        groupId,
      },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        assignedTo: { select: { id: true, username: true, avatarUrl: true } },
      },
    });

    res.status(201).json(dare);
  } catch (error) {
    console.error("Create dare error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Claim (self-assign) a Dare ──────────────────────────

router.patch("/:id/dares/:dareId/claim", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const groupId = req.params.id as string;
    const dareId = req.params.dareId as string;

    // Verify membership
    const membership = await prisma.groupMember.findUnique({
      where: { userId_groupId: { userId: req.userId!, groupId } },
    });

    if (!membership) {
      res.status(403).json({ error: "You are not a member of this group" });
      return;
    }

    const dare = await prisma.dare.findUnique({ where: { id: dareId } });

    if (!dare || dare.groupId !== groupId) {
      res.status(404).json({ error: "Dare not found" });
      return;
    }

    if (dare.assignedToId) {
      res.status(409).json({ error: "This dare is already assigned" });
      return;
    }

    // Award +5 XP for claiming a dare
    const [updated] = await prisma.$transaction([
      prisma.dare.update({
        where: { id: dareId },
        data: { assignedToId: req.userId! },
        include: {
          author: { select: { id: true, username: true, avatarUrl: true } },
          assignedTo: { select: { id: true, username: true, avatarUrl: true } },
        },
      }),
    ]);

    await updateUserXp(req.userId!, 5);

    res.json(updated);
  } catch (error) {
    console.error("Claim dare error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Update Dare ─────────────────────────────────────────

router.patch("/:id/dares/:dareId", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const groupId = req.params.id as string;
    const dareId = req.params.dareId as string;

    const dare = await prisma.dare.findUnique({ where: { id: dareId } });

    if (!dare || dare.groupId !== groupId) {
      res.status(404).json({ error: "Dare not found" });
      return;
    }

    if (dare.status !== "OPEN") {
      res.status(400).json({ error: "Cannot update a dare that is already completed or passed" });
      return;
    }

    // Only author can update
    if (dare.authorId !== req.userId) {
      res.status(403).json({ error: "Only the dare creator can update it" });
      return;
    }

    const { title, description, difficulty, xpReward } = req.body;

    const validDifficulties = ["EASY", "MEDIUM", "HARD", "EXTREME"];
    const diff = difficulty && validDifficulties.includes(difficulty) ? difficulty : undefined;

    const xpCaps: Record<string, number> = { EASY: 25, MEDIUM: 50, HARD: 100, EXTREME: 200 };
    const effectiveDiff = diff || dare.difficulty;
    const cap = xpCaps[effectiveDiff] ?? 25;

    const data: Record<string, unknown> = {};
    if (title) data.title = title.trim();
    if (description) data.description = description.trim();
    if (diff) data.difficulty = diff;
    if (xpReward !== undefined) data.xpReward = Math.min(Math.max(Number(xpReward) || 10, 1), cap);

    const updated = await prisma.dare.update({
      where: { id: dareId },
      data,
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        assignedTo: { select: { id: true, username: true, avatarUrl: true } },
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Update dare error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Delete Dare ─────────────────────────────────────────

router.delete("/:id/dares/:dareId", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const groupId = req.params.id as string;
    const dareId = req.params.dareId as string;

    const dare = await prisma.dare.findUnique({ where: { id: dareId } });

    if (!dare || dare.groupId !== groupId) {
      res.status(404).json({ error: "Dare not found" });
      return;
    }

    if (dare.status !== "OPEN") {
      res.status(400).json({ error: "Cannot delete a dare that is already completed or passed" });
      return;
    }

    // Only author or group owner can delete
    const membership = await prisma.groupMember.findUnique({
      where: { userId_groupId: { userId: req.userId!, groupId } },
    });

    if (dare.authorId !== req.userId && membership?.role !== "OWNER") {
      res.status(403).json({ error: "Only the dare creator or group owner can delete it" });
      return;
    }

    // Delete related responses first
    await prisma.dareResponse.deleteMany({ where: { dareId } });
    await prisma.dare.delete({ where: { id: dareId } });

    res.json({ success: true });
  } catch (error) {
    console.error("Delete dare error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Complete Dare ───────────────────────────────────────

router.patch("/:id/dares/:dareId/complete", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const groupId = req.params.id as string;
    const dareId = req.params.dareId as string;

    // Verify membership
    const membership = await prisma.groupMember.findUnique({
      where: { userId_groupId: { userId: req.userId!, groupId } },
    });

    if (!membership) {
      res.status(403).json({ error: "You are not a member of this group" });
      return;
    }

    const dare = await prisma.dare.findUnique({ where: { id: dareId } });

    if (!dare || dare.groupId !== groupId) {
      res.status(404).json({ error: "Dare not found" });
      return;
    }

    if (dare.status !== "OPEN") {
      res.status(400).json({ error: "Dare status has already been set" });
      return;
    }

    // Only the assigned user can change the status
    if (dare.assignedToId !== req.userId) {
      res.status(403).json({ error: "Only the assigned user can change the dare status" });
      return;
    }

    const { status } = req.body;
    const validStatuses = ["COMPLETED", "PASSED", "FAILED"];
    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({ error: "Status must be COMPLETED, PASSED, or FAILED" });
      return;
    }

    // Update dare status
    const updated = await prisma.dare.update({
      where: { id: dareId },
      data: { status, completedAt: new Date() },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        assignedTo: { select: { id: true, username: true, avatarUrl: true } },
      },
    });

    // XP changes for the assignee
    if (dare.assignedToId) {
      if (status === "COMPLETED") {
        // Award the dare's XP
        await updateUserXp(dare.assignedToId, dare.xpReward);
      } else {
        // PASSED or FAILED: deduct 200% of dare XP
        await updateUserXp(dare.assignedToId, -(dare.xpReward * 2));
      }
    }

    res.json(updated);
  } catch (error) {
    console.error("Complete dare error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
