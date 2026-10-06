import axiosInstance from "@/lib/axiosInstance";
import { API_ROUTES } from "@/constants/api";
import {
  SalesmanPermission,
  SalesmanQueryParams,
} from "@/types/salesman.types";

export const salesmanService = {
  getSalesmen: async (params?: SalesmanQueryParams) => {
    const response = await axiosInstance.get(API_ROUTES.SALESMEN.LIST, {
      params,
    });
    return response?.data;
  },

  getSalesmanById: async (id: string) => {
    const response = await axiosInstance.get(API_ROUTES.SALESMEN.DETAIL(id));
    return response?.data;
  },

  createSalesman: async (data: {
    fullName: string;
    email: string;
    password: string;
    permissions: SalesmanPermission[];
  }) => {
    const response = await axiosInstance.post(API_ROUTES.SALESMEN.CREATE, data);
    return response?.data;
  },

  updateSalesman: async (
    id: string,
    data: { fullName?: string; permissions?: SalesmanPermission[] },
  ) => {
    const response = await axiosInstance.patch(
      API_ROUTES.SALESMEN.UPDATE(id),
      data,
    );
    return response?.data;
  },

  updateSalesmanStatus: async (id: string, isActive: boolean) => {
    const response = await axiosInstance.patch(
      API_ROUTES.SALESMEN.UPDATE_STATUS(id),
      { isActive },
    );
    return response?.data;
  },
};
