import { ProductRow } from "./product/product.types";

export interface CartItem {
  product: ProductRow;
  quantity: number;
}

export interface CartContextValue {
  items: CartItem[];
  addItem: (product: ProductRow, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  ready: boolean;
}
