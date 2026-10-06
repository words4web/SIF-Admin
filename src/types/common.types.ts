export interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export interface SidebarProps {
  pathname: string;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export interface SocketToastPayload {
  message: string;
  type?: "info" | "success" | "warning" | "error";
}

export interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export interface CategoryOption {
  value: string;
  label: string;
}

export interface PageFiltersProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  categoryValue?: string;
  onCategoryChange?: (categoryId: string) => void;
  categoryOptions?: CategoryOption[];
  categoryPlaceholder?: string;
  isLoadingCategories?: boolean;
  extraFilters?: React.ReactNode;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
}
