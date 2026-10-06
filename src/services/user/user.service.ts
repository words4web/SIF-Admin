import axiosInstance from "@/lib/axiosInstance";
import { API_ROUTES } from "@/constants/api";

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const userService = {
  getUsers: async (params?: UserQueryParams) => {
    const response = await axiosInstance.get(API_ROUTES.USERS.LIST, { params });
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await axiosInstance.get(API_ROUTES.USERS.DETAIL(id));
    return response.data;
  },

  updateUserStatus: async (id: string, isActive: boolean) => {
    const response = await axiosInstance.patch(
      API_ROUTES.USERS.UPDATE_STATUS(id),
      { isActive },
    );
    return response.data;
  },

  updateUserPriceList: async (id: string, priceListId: string | null) => {
    const response = await axiosInstance.patch(
      API_ROUTES.USERS.UPDATE_PRICE_LIST(id),
      { priceListId },
    );
    return response.data;
  },
};
