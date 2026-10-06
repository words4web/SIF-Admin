import { Socket } from "socket.io-client";
import { QueryClient } from "@tanstack/react-query";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { registerToastListener } from "./toast.listener";
import { registerOrderListener } from "./order.listener";

export function registerAllSocketListeners(
  socket: Socket,
  queryClient: QueryClient,
  router?: AppRouterInstance,
) {
  registerToastListener(socket);
  registerOrderListener(socket, queryClient, router);
}
