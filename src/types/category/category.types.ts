export interface CategoryRow {
  _id: string;
  name: string;
  slug: string;
  image?: string | null;
  tagline?: string | null;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPayload {
  name: string;
  slug: string;
  image?: string | null;
  tagline?: string | null;
  description?: string | null;
  isActive?: boolean;
}

export interface CategoryFormValues {
  name: string;
  slug: string;
  image?: (string | File)[];
  tagline?: string;
  description?: string;
  isActive: boolean;
}

export interface CategoryFormProps {
  defaultValues?: Partial<CategoryFormValues>;
  onSubmit: (values: CategoryFormValues) => void;
  isLoading?: boolean;
  submitLabel?: string;
}
