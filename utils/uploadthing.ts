import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export const { useUploadThing } = generateReactHelpers<OurFileRouter>();

// Export uploadFiles with proper typing
export const uploadFiles = async (opts: {
  endpoint: keyof OurFileRouter;
  files: File[];
}) => {
  const { startUpload } = useUploadThing(opts.endpoint);
  return startUpload(opts.files);
};


