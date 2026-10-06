import axiosInstance from "@/lib/axiosInstance";
import { API_ROUTES } from "@/constants/api";

export interface SyncDevicePayload {
  fcmToken: string;
  platform: string;
  OSVersion?: string;
}

export interface RemoveDevicePayload {
  fcmToken: string;
}

export const notificationService = {
  syncDevice: async (payload: SyncDevicePayload) => {
    const response = await axiosInstance.post(
      "/admin/notification/devices/sync",
      payload,
    );
    return response.data;
  },

  removeDevice: async (payload: RemoveDevicePayload) => {
    const response = await axiosInstance.post(
      "/admin/notification/devices/remove",
      payload,
    );
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await axiosInstance.get(
      "/admin/notification/unread-count",
    );
    return response.data;
  },

  getNotifications: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get("/admin/notification", {
      params: { page, limit },
    });
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await axiosInstance.patch(
      `/admin/notification/${id}/read`,
    );
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await axiosInstance.patch("/admin/notification/read-all");
    return response.data;
  },
};
