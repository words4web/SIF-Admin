import { SalesmanPermission } from "@/types/salesman.types";

export interface SalesmanFormValues {
  fullName: string;
  email?: string;
  password?: string;
  permissions: SalesmanPermission[];
}

export interface SalesmanFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<SalesmanFormValues>;
  onSubmit: (values: SalesmanFormValues) => void;
  onDirtyChange?: (isDirty: boolean) => void;
  disabled?: boolean;
}

export interface SalesmanPermissionSelectorProps {
  selectedPermissions: SalesmanPermission[];
  onToggle: (permission: SalesmanPermission) => void;
  error?: string;
  disabled?: boolean;
}
