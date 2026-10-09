import { DropdownOption } from "@/components/common/PaginatedDropdown";
import { EStockStatus } from "@/constants/product.constants";

export interface ProductVariant {
  weight: number;
  price: number;
}

export interface RelatedProductItem {
  _id: string;
  name: string;
  slug?: string;
  sku?: string;
  description?: string;
  variants?: ProductVariant[];
}

export interface ProductRow {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  variants: ProductVariant[];
  stock: number;
  stockStatus: EStockStatus;
  categoryId:
    | {
        _id: string;
        name: string;
      }
    | string;
  keywords?: string[];
  images?: string[];
  relatedProducts?: RelatedProductItem[] | string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPayload {
  name: string;
  slug: string;
  sku: string;
  description?: string;
  variants: ProductVariant[];
  stock?: number;
  stockStatus?: EStockStatus;
  categoryId: string;
  keywords: string[];
  images?: string[];
  relatedProducts?: string[];
  isActive?: boolean;
}

export interface ProductFormValues {
  name: string;
  slug: string;
  sku: string;
  description?: string;
  variants: ProductVariant[];
  stock: number;
  stockStatus: EStockStatus;
  categoryId: string;
  keywords: string[];
  images: string[];
  relatedProducts: string[];
  isActive: boolean;
}

export interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  initialRelatedOptions?: DropdownOption[];
  currentProductId?: string;
  onSubmit: (values: ProductFormValues) => void;
  onDirtyChange?: (isDirty: boolean) => void;
  disabled?: boolean;
}
