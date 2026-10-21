import type { UseFormRegister, FieldErrors } from "react-hook-form";

export interface LocalizedString {
  en: string;
  it: string;
}

export interface CategoryRow {
  _id: string;
  name: LocalizedString;
  slug: string;
  image?: string | null;
  tagline?: LocalizedString | null;
  description?: LocalizedString | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPayload {
  name: LocalizedString;
  slug: string;
  image?: string | null;
  tagline?: LocalizedString | null;
  description?: LocalizedString | null;
  isActive?: boolean;
}

export interface CategoryFormValues {
  name: LocalizedString;
  slug: string;
  image?: (string | File)[];
  tagline?: LocalizedString;
  description?: LocalizedString;
  isActive: boolean;
}

export interface CategoryFormProps {
  defaultValues?: Partial<CategoryFormValues>;
  onSubmit: (values: CategoryFormValues) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export interface CategoryLanguagePanelProps {
  lang: "en" | "it";
  flag: string;
  title: string;
  subtitle: string;
  nameLabel: string;
  namePlaceholder: string;
  nameRequiredMsg: string;
  taglineLabel: string;
  taglinePlaceholder: string;
  taglineMaxMsg: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  descriptionMaxMsg: string;
  taglineValue: string;
  descriptionValue: string;
  register: UseFormRegister<CategoryFormValues>;
  errors: FieldErrors<CategoryFormValues>;
  isLoading?: boolean;
}
