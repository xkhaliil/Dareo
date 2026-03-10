import { Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../db.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET ;

// ─── Sign Up ─────────────────────────────────────────────

router.post("/sign-up", async (req: Request, res: Response) => {
  try {
    const { username, email, password, avatarUrl } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: "Username, email, and password are required" });
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      const field = existingUser.email === email ? "email" : "username";
      res.status(409).json({ error: `A user with this ${field} already exists` });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        avatarUrl: avatarUrl || null,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        xp: user.xp,
        level: user.level,
        rank: user.rank,
      },
    });
  } catch (error) {
    console.error("Sign-up error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Sign In ─────────────────────────────────────────────

router.post("/sign-in", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        xp: user.xp,
        level: user.level,
        rank: user.rank,
      },
    });
  } catch (error) {
    console.error("Sign-in error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
