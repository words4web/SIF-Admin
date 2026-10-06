import { axiosInstance } from "@/lib/axiosInstance";
import { API_ROUTES } from "@/constants/api";

export const orderService = {
  list: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    const response = await axiosInstance.get(API_ROUTES.ORDERS.LIST, {
      params,
    });
    return response?.data;
  },
  detail: async (id: string) => {
    const response = await axiosInstance.get(API_ROUTES.ORDERS.DETAIL(id));
    return response?.data;
  },
  create: async (payload: {
    userId: string;
    addressId: string;
    items: { productId: string; quantity: number }[];
    notes?: string;
  }) => {
    const response = await axiosInstance.post(
      API_ROUTES.ORDERS.CREATE,
      payload,
    );
    return response?.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await axiosInstance.patch(
      API_ROUTES.ORDERS.UPDATE_STATUS(id),
      { status },
    );
    return response?.data;
  },
};
export default orderService;
