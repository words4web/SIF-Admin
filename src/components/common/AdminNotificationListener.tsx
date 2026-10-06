"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { onForegroundMessage } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { useAdminFcmLifecycle } from "@/hooks/useAdminFcmLifecycle";

export function AdminNotificationListener() {
  const { user, ready } = useAuth();
  const isAuthenticated = ready && !!user;
  const queryClient = useQueryClient();
  const router = useRouter();

  useAdminFcmLifecycle();

  useEffect(() => {
    if (!isAuthenticated) return;

    let unsubscribe: (() => void) | null = null;

    const subscribe = async () => {
      unsubscribe = await onForegroundMessage((payload) => {
        const notification = payload?.notification ?? {};
        const data = payload?.data ?? {};
        const title =
          notification?.title ?? data?.title ?? "New Order Notification";
        const body = notification?.body ?? data?.body ?? "";
        const orderId = data?._id || data?.orderId;

        toast(title, {
          description: body,
          duration: 6000,
          action: orderId
            ? {
                label: "View Order",
                onClick: () => router.push(ROUTES.ORDERS.DETAIL(orderId)),
              }
            : undefined,
        });

        queryClient.invalidateQueries({
          queryKey: ["admin", "orders"],
        });
      });
    };

    subscribe();

    return () => {
      unsubscribe?.();
    };
  }, [isAuthenticated, queryClient, router]);

  return null;
}
