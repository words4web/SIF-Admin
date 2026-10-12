import { axiosInstance } from "@/lib/axiosInstance";
import { API_ROUTES } from "@/constants/api";
import {
  ISystemConfig,
  IUpdateConfigPayload,
} from "@/types/config/config.types";

export const configService = {
  getConfig: async (): Promise<ISystemConfig> => {
    const response = await axiosInstance.get(API_ROUTES.CONFIG);
    return response?.data?.data;
  },

  updateConfig: async (
    payload: IUpdateConfigPayload,
  ): Promise<ISystemConfig> => {
    const response = await axiosInstance.put(API_ROUTES.CONFIG, payload);
    return response?.data?.data;
  },
};
