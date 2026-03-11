import "dotenv/config";
import express from "express";
import cors from "cors";
import { createRouteHandler } from "uploadthing/express";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import groupRouter from "./routes/group.js";
import { uploadRouter } from "./uploadthing.js";

const app = express();
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/groups", groupRouter);
app.use(
  "/api/uploadthing",
  createRouteHandler({ router: uploadRouter })
);

export default app;
