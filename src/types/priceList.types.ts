import { ProductRow } from "./product/product.types";

export interface PriceListProductItem {
  productId: string | ProductRow | any;
  price: number;
}

export interface PriceList {
  _id: string;
  name: string;
  products: PriceListProductItem[];
  productsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePriceListPayload {
  name: string;
  products: {
    productId: string;
    price: number;
  }[];
}

export interface UpdatePriceListPayload {
  name?: string;
  products?: {
    productId: string;
    price: number;
  }[];
}

export interface SelectedProductRow {
  productId: string;
  name: string;
  pack: string;
  basePrice: number;
  customPrice: number;
  images?: string[];
}

export interface UserPriceListSectionProps {
  userId: string;
  userName?: string;
  assignedPriceList?:
    | {
        _id: string;
        name: string;
      }
    | null
    | any;
  onSuccess?: () => void;
}

export interface PriceListFormData {
  name: string;
  products: {
    productId: string;
    price: number;
  }[];
}

export interface PriceListFormProps {
  initialName?: string;
  initialProducts?: SelectedProductRow[];
  onSubmit: (data: PriceListFormData) => void;
  isPending?: boolean;
  submitLabel?: string;
  pendingLabel?: string;
}
