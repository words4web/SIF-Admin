import { axiosInstance } from "@/lib/axiosInstance";
import { API_ROUTES } from "@/constants/api";
import { CategoryPayload } from "@/types/category/category.types";

export const categoryService = {
  list: async (params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    search?: string;
  }) => {
    const response = await axiosInstance.get(API_ROUTES.CATEGORIES.LIST, {
      params,
    });
    return response?.data;
  },

  getDetail: async (id: string) => {
    const response = await axiosInstance.get(API_ROUTES.CATEGORIES.DETAIL(id));
    return response?.data;
  },

  create: async (payload: CategoryPayload) => {
    const response = await axiosInstance.post(
      API_ROUTES.CATEGORIES.CREATE,
      payload,
    );
    return response?.data;
  },

  update: async (id: string, payload: Partial<CategoryPayload>) => {
    const response = await axiosInstance.put(
      API_ROUTES.CATEGORIES.UPDATE(id),
      payload,
    );
    return response?.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete(
      API_ROUTES.CATEGORIES.DELETE(id),
    );
    return response?.data;
  },
};
