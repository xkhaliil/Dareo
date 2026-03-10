import { Router, type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../db.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;

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

// ─── Get Profile ─────────────────────────────────────────

router.get("/profile", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      xp: user.xp,
      level: user.level,
      rank: user.rank,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Update Profile ──────────────────────────────────────

router.patch("/profile", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { username, email, avatarUrl } = req.body;

    // Check for conflicts if changing username or email
    if (username || email) {
      const conditions = [];
      if (username) conditions.push({ username });
      if (email) conditions.push({ email });

      const existing = await prisma.user.findFirst({
        where: {
          OR: conditions,
          NOT: { id: req.userId },
        },
      });

      if (existing) {
        const field = email && existing.email === email ? "email" : "username";
        res.status(409).json({ error: `A user with this ${field} already exists` });
        return;
      }
    }

    const data: Record<string, string> = {};
    if (username) data.username = username;
    if (email) data.email = email;
    if (avatarUrl !== undefined) data.avatarUrl = avatarUrl;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data,
    });

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      xp: user.xp,
      level: user.level,
      rank: user.rank,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
