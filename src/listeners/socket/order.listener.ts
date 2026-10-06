import { Socket } from "socket.io-client";
import { QueryClient } from "@tanstack/react-query";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";

export function registerOrderListener(
  socket: Socket,
  queryClient: QueryClient,
  router?: AppRouterInstance,
) {
  socket.on(
    "order:created",
    (data: {
      _id?: string;
      orderId?: string;
      totalAmount?: number;
      customerName?: string;
    }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      const customer = data?.customerName ? ` by ${data?.customerName}` : "";

      toast.success(`New order ${data?.orderId || ""} placed${customer}!`, {
        action: data?._id
          ? {
              label: "View Order",
              onClick: () => {
                const targetUrl = ROUTES.ORDERS.DETAIL(data?._id!);
                if (router) {
                  router.push(targetUrl);
                } else {
                  window.location.href = targetUrl;
                }
              },
            }
          : undefined,
      });
    },
  );
}
