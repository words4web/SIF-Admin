import axiosInstance from "@/lib/axiosInstance";
import { API_ROUTES } from "@/constants/api";
import {
  CreatePriceListPayload,
  UpdatePriceListPayload,
} from "@/types/priceList.types";

export interface PriceListQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const priceListService = {
  list: async (params?: PriceListQueryParams) => {
    const response = await axiosInstance.get(API_ROUTES.PRICE_LISTS.LIST, {
      params,
    });
    return response?.data;
  },

  getAllLean: async () => {
    const response = await axiosInstance.get(API_ROUTES.PRICE_LISTS.LEAN);
    return response?.data;
  },

  getDetail: async (id: string) => {
    const response = await axiosInstance.get(API_ROUTES.PRICE_LISTS.DETAIL(id));
    return response?.data;
  },

  create: async (payload: CreatePriceListPayload) => {
    const response = await axiosInstance.post(
      API_ROUTES.PRICE_LISTS.CREATE,
      payload,
    );
    return response?.data;
  },

  update: async (id: string, payload: UpdatePriceListPayload) => {
    const response = await axiosInstance.patch(
      API_ROUTES.PRICE_LISTS.UPDATE(id),
      payload,
    );
    return response?.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete(
      API_ROUTES.PRICE_LISTS.DELETE(id),
    );
    return response?.data;
  },
};
