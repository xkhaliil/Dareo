import { generateReactHelpers } from "@uploadthing/react";
import type { AppFileRouter } from "../../server/uploadthing";
import { API_URL } from "./api";

export const { useUploadThing } = generateReactHelpers<AppFileRouter>({
  url: `${API_URL}/api/uploadthing`,
});
