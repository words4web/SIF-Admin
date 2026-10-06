import { DropdownOption } from "@/components/common/PaginatedDropdown";
import { EProductUnit } from "@/constants/product.constants";

export interface RelatedProductItem {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  pack?: string;
  price?: number;
  unit?: EProductUnit;
}

export interface ProductRow {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  pack: string;
  price: number;
  unit: EProductUnit;
  categoryId:
    | {
        _id: string;
        name: string;
      }
    | string;
  keywords?: string[];
  images?: string[];
  relatedProducts?: RelatedProductItem[] | string[];
  isVatApplicable: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPayload {
  name: string;
  slug: string;
  description?: string;
  pack: string;
  price: number;
  unit: EProductUnit;
  categoryId: string;
  keywords: string[];
  images?: string[];
  relatedProducts?: string[];
  isVatApplicable?: boolean;
  isActive?: boolean;
}

export interface ProductFormValues {
  name: string;
  slug: string;
  description?: string;
  pack: string;
  price: number;
  unit: EProductUnit;
  categoryId: string;
  keywords: string[];
  images: string[];
  relatedProducts: string[];
  isVatApplicable: boolean;
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
