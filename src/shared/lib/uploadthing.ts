import { generateReactHelpers } from "@uploadthing/react";
import type { FileRouter } from "uploadthing/types";

import { API_URL } from "./api";

export type AppFileRouter = {
  avatarUploader: FileRouter[string];
};

export const { useUploadThing } = generateReactHelpers<AppFileRouter>({
  url: `${API_URL}/api/uploadthing`,
});
