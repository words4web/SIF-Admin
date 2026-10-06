import { OrderConfirmation } from "@/types/order.types";

const ORDER_KEY = "indian-supplies-last-order";

export function saveLastOrder(order: OrderConfirmation) {
  window.sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

export function readLastOrder(): OrderConfirmation | null {
  if (typeof window === "undefined") return null;
  const saved = window.sessionStorage.getItem(ORDER_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved) as OrderConfirmation;
  } catch {
    return null;
  }
}
