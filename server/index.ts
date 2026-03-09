import "dotenv/config";
import express from "express";
import cors from "cors";
import { createRouteHandler } from "uploadthing/express";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import { uploadRouter } from "./uploadthing.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use(
  "/api/uploadthing",
  createRouteHandler({ router: uploadRouter })
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
