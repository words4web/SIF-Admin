export type SalesmanPermission =
  | "category_management"
  | "product_management"
  | "order_management"
  | "order_create"
  | "user_management";

export interface ISalesman {
  _id: string;
  fullName: string;
  email: string;
  permissions: SalesmanPermission[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const SALESMAN_PERMISSION_LABELS: Record<
  SalesmanPermission,
  { label: string; description: string }
> = {
  category_management: {
    label: "Category Management",
    description: "View, create, edit, and delete product categories",
  },
  product_management: {
    label: "Product Management",
    description: "View, create, edit, and delete products",
  },
  order_management: {
    label: "Order Management",
    description: "View and manage all customer orders",
  },
  order_create: {
    label: "Create Orders",
    description: "Access the dedicated create-order interface",
  },
  user_management: {
    label: "User Management",
    description: "View and manage customer accounts",
  },
};

export const ALL_PERMISSIONS = Object.keys(
  SALESMAN_PERMISSION_LABELS,
) as SalesmanPermission[];

export interface SalesmanQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}
