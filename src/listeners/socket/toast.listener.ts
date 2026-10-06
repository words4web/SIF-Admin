import { Socket } from "socket.io-client";
import { toast } from "sonner";
import { SocketToastPayload } from "@/types/common.types";

export function registerToastListener(socket: Socket) {
  socket.on("admin:toast", (data: SocketToastPayload) => {
    const { message, type = "info" } = data;
    if (!message) return;

    const toastFn = (toast as any)[type];
    if (typeof toastFn === "function") {
      toastFn(message);
    } else {
      toast(message);
    }
  });
}
