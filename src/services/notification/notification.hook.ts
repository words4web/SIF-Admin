import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  notificationService,
  SyncDevicePayload,
  RemoveDevicePayload,
} from "./notification.service";
import { setUnreadCount } from "@/store/notificationSlice";

export const NOTIFICATION_QUERY_KEYS = {
  all: ["admin", "notifications"] as const,
  unreadCount: ["admin", "notifications", "unreadCount"] as const,
  list: (page = 1, limit = 10) =>
    ["admin", "notifications", "list", page, limit] as const,
};

export const useSyncDevice = () => {
  return useMutation({
    mutationFn: (payload: SyncDevicePayload) =>
      notificationService.syncDevice(payload),
  });
};

export const useRemoveDevice = () => {
  return useMutation({
    mutationFn: (payload: RemoveDevicePayload) =>
      notificationService.removeDevice(payload),
  });
};

export const useUnreadCountQuery = (enabled = true) => {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
    queryFn: () => notificationService.getUnreadCount(),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
};

export const useNotificationsQuery = (page = 1, limit = 10, enabled = true) => {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.list(page, limit),
    queryFn: () => notificationService.getNotifications(page, limit),
    enabled,
  });
};

export const useMarkReadMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.all,
      });

      const previousQueries = queryClient.getQueriesData({
        queryKey: NOTIFICATION_QUERY_KEYS.all,
      });

      queryClient.setQueriesData(
        { queryKey: NOTIFICATION_QUERY_KEYS.unreadCount },
        (old: any) => {
          if (!old) return old;
          const newCount = Math.max(0, (old.count ?? 1) - 1);
          dispatch(setUnreadCount(newCount));
          return { ...old, count: newCount };
        },
      );

      queryClient.setQueriesData(
        { queryKey: NOTIFICATION_QUERY_KEYS.all },
        (oldData: any) => {
          if (!oldData) return oldData;

          if (Array.isArray(oldData?.data?.notifications)) {
            return {
              ...oldData,
              data: {
                ...oldData.data,
                notifications: oldData.data.notifications.map((n: any) =>
                  n._id === id ? { ...n, isRead: true } : n,
                ),
              },
            };
          }

          if (Array.isArray(oldData?.data)) {
            return {
              ...oldData,
              data: oldData.data.map((n: any) =>
                n._id === id ? { ...n, isRead: true } : n,
              ),
            };
          }

          return oldData;
        },
      );

      return { previousQueries };
    },
    onError: (_err, _id, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.all,
      });
    },
  });
};

export const useMarkAllReadMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.all,
      });

      const previousQueries = queryClient.getQueriesData({
        queryKey: NOTIFICATION_QUERY_KEYS.all,
      });

      dispatch(setUnreadCount(0));
      queryClient.setQueriesData(
        { queryKey: NOTIFICATION_QUERY_KEYS.unreadCount },
        (old: any) => (old ? { ...old, count: 0 } : old),
      );

      queryClient.setQueriesData(
        { queryKey: NOTIFICATION_QUERY_KEYS.all },
        (oldData: any) => {
          if (!oldData) return oldData;

          if (Array.isArray(oldData?.data?.notifications)) {
            return {
              ...oldData,
              data: {
                ...oldData.data,
                notifications: oldData.data.notifications.map((n: any) => ({
                  ...n,
                  isRead: true,
                })),
              },
            };
          }

          if (Array.isArray(oldData?.data)) {
            return {
              ...oldData,
              data: oldData.data.map((n: any) => ({ ...n, isRead: true })),
            };
          }

          return oldData;
        },
      );

      return { previousQueries };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.all,
      });
    },
  });
};
