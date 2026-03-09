import { createUploadthing, type FileRouter } from "uploadthing/express";

const f = createUploadthing();

export const uploadRouter = {
  avatarUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(({ file }) => {
    return { url: file.ufsUrl };
  }),
} satisfies FileRouter;

export type AppFileRouter = typeof uploadRouter;
