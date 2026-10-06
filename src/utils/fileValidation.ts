import { toast } from "sonner";

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

export function filterValidImageFiles(
  files: FileList | File[],
  maxSizeMB: number = 3,
): File[] {
  const validFiles: File[] = [];
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  Array.from(files)?.forEach((file) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file?.type.toLowerCase())) {
      toast.error(
        `"${file?.name}" is not a valid image. Only JPEG, PNG, and WebP are allowed.`,
      );
      return;
    }
    if (file?.size > maxSizeBytes) {
      toast.error(
        `"${file?.name}" exceeds the max file size limit of ${maxSizeMB}MB.`,
      );
      return;
    }
    validFiles.push(file);
  });

  return validFiles;
}
