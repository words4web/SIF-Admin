import { axiosInstance } from "@/lib/axiosInstance";
import { API_ROUTES } from "@/constants/api";

export const authService = {
  login: async (payload: { email: string; password?: string }) => {
    const response = await axiosInstance.post(API_ROUTES.AUTH.LOGIN, payload);
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post(API_ROUTES.AUTH.LOGOUT);
    return response.data;
  },

  refreshToken: async () => {
    const response = await axiosInstance.post(API_ROUTES.AUTH.REFRESH_TOKEN);
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get(API_ROUTES.PROFILE);
    return response.data;
  },
};
