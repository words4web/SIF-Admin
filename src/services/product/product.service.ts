import { axiosInstance } from "@/lib/axiosInstance";
import { API_ROUTES } from "@/constants/api";
import { ProductPayload } from "@/types/product/product.types";

export const productService = {
  list: async (params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    isActive?: boolean;
    search?: string;
  }) => {
    const response = await axiosInstance.get(API_ROUTES.PRODUCTS.LIST, {
      params,
    });
    return response?.data;
  },

  getCatalog: async (params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    search?: string;
  }) => {
    const response = await axiosInstance.get(API_ROUTES.PRODUCTS.CATALOG, {
      params,
    });
    return response?.data;
  },

  getDetail: async (id: string) => {
    const response = await axiosInstance.get(API_ROUTES.PRODUCTS.DETAIL(id));
    return response?.data;
  },

  create: async (payload: ProductPayload) => {
    const response = await axiosInstance.post(
      API_ROUTES.PRODUCTS.CREATE,
      payload,
    );
    return response?.data;
  },

  update: async (id: string, payload: Partial<ProductPayload>) => {
    const response = await axiosInstance.put(
      API_ROUTES.PRODUCTS.UPDATE(id),
      payload,
    );
    return response?.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete(API_ROUTES.PRODUCTS.DELETE(id));
    return response?.data;
  },
};
