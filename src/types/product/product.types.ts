import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { DropdownOption } from "@/components/common/PaginatedDropdown";
import { EStockStatus } from "@/constants/product.constants";
import { LocalizedString } from "@/types/category/category.types";

export interface ProductVariant {
  weight: number;
  price: number;
  stock: number;
}

export interface RelatedProductItem {
  _id: string;
  name: LocalizedString | string;
  slug?: string;
  sku?: string;
  description?: LocalizedString | string;
  variants?: ProductVariant[];
}

export interface ProductRow {
  _id: string;
  name: LocalizedString;
  slug: string;
  sku: string;
  description?: LocalizedString | null;
  variants: ProductVariant[];
  categoryId:
    | {
        _id: string;
        name: LocalizedString | string;
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
  name: LocalizedString;
  slug: string;
  sku: string;
  description?: LocalizedString | null;
  variants: ProductVariant[];
  categoryId: string;
  keywords: string[];
  images?: string[];
  relatedProducts?: string[];
  isActive?: boolean;
}

export interface ProductFormValues {
  name: LocalizedString;
  slug: string;
  sku: string;
  description?: LocalizedString;
  variants: ProductVariant[];
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

export interface ProductLanguagePanelProps {
  lang: "en" | "it";
  flag: string;
  title: string;
  subtitle: string;
  nameLabel: string;
  namePlaceholder: string;
  nameRequiredMsg: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  descriptionValue: string;
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  disabled?: boolean;
  onNameChange?: (val: string) => void;
}
