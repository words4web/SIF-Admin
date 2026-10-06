import axios from "axios";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axiosInstance";
import { API_ROUTES } from "@/constants/api";
import { GetUploadUrlsResponse } from "@/types/upload.types";

export const uploadService = {
  getUploadUrls: async (
    fileMetas: { originalName: string; contentType: string; size: number }[],
    folder: "products" | "categories" = "products",
  ): Promise<GetUploadUrlsResponse> => {
    const response = await axiosInstance.post(API_ROUTES.UPLOAD.GET_URLS, {
      files: fileMetas,
      folder,
    });
    return response.data?.data;
  },

  uploadToS3: async (uploadUrl: string, file: File): Promise<void> => {
    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
  },

  confirmUploads: async (
    sessionId: string,
    keys: string[],
  ): Promise<string[]> => {
    const response = await axiosInstance.post(API_ROUTES.UPLOAD.CONFIRM, {
      sessionId,
      keys,
    });
    return response.data?.data?.images || [];
  },

  uploadImages: async (
    files: File[],
    folder: "products" | "categories" = "products",
  ): Promise<string[]> => {
    if (!files || files?.length === 0) return [];

    const fileMetas = files?.map((file) => ({
      originalName: file?.name,
      contentType: file?.type || "image/jpeg",
      size: file?.size,
    }));

    const { sessionId, files: presignedFiles } =
      await uploadService?.getUploadUrls(fileMetas, folder);

    const uploadPromises = presignedFiles?.map((item, index) =>
      uploadService?.uploadToS3(item?.uploadUrl, files[index]),
    );
    await Promise.all(uploadPromises);

    const keys = presignedFiles?.map((item) => item?.key);
    const confirmedUrls = await uploadService.confirmUploads(sessionId, keys);

    return confirmedUrls;
  },

  processFormImages: async (
    rawImages: (string | File)[] = [],
    folder: "products" | "categories" = "products",
  ): Promise<string[]> => {
    const existingUrls: string[] = [];
    const pendingFiles: File[] = [];

    rawImages?.forEach((item: any) => {
      if (item instanceof File) {
        pendingFiles.push(item);
      } else if (typeof item === "string" && item?.trim()?.length > 0) {
        existingUrls.push(item);
      }
    });

    let newlyUploadedUrls: string[] = [];
    if (pendingFiles?.length > 0) {
      toast.info(`Uploading ${pendingFiles?.length} image(s)...`);
      newlyUploadedUrls = await uploadService.uploadImages(
        pendingFiles,
        folder,
      );
    }

    return [...existingUrls, ...newlyUploadedUrls];
  },
};
