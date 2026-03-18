import "dotenv/config";

import cors from "cors";
import express from "express";
import { createRouteHandler } from "uploadthing/express";

import authRouter from "./routes/auth.js";
import groupRouter from "./routes/group.js";
import userRouter from "./routes/user.js";
import { uploadRouter } from "./uploadthing.js";

const app = express();
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://dareo.vercel.app",
      "https://xkhaliil.github.io/Dareo/",
    ],
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/groups", groupRouter);
app.use("/api/uploadthing", createRouteHandler({ router: uploadRouter }));

export default app;
