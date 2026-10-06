import { ROUTES } from "@/constants/routes";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Package,
  Tag,
  Users,
  UserCheck,
  Bell,
  Settings,
  ReceiptText,
  LucideIcon,
} from "lucide-react";
import { SalesmanPermission } from "@/types/salesman.types";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  permission?: SalesmanPermission;
  adminOnly?: boolean;
}

export const NAVIGATION_ITEMS: NavItem[] = [
  { name: "Overview", href: ROUTES.HOME, icon: LayoutDashboard },
  {
    name: "Categories",
    href: ROUTES.CATEGORIES.ROOT,
    icon: Tag,
    permission: "category_management",
  },
  {
    name: "Products",
    href: ROUTES.PRODUCTS.ROOT,
    icon: Package,
    permission: "product_management",
  },
  {
    name: "Orders",
    href: ROUTES.ORDERS.ROOT,
    icon: ShoppingBag,
    permission: "order_management",
  },
  {
    name: "Create Order",
    href: ROUTES.ORDERS.NEW,
    icon: ShoppingCart,
    permission: "order_create",
  },
  {
    name: "Notifications",
    href: ROUTES.NOTIFICATIONS,
    icon: Bell,
    adminOnly: true,
  },
  {
    name: "Salesmen",
    href: ROUTES.SALESMEN.ROOT,
    icon: UserCheck,
    adminOnly: true,
  },
  {
    name: "Users",
    href: ROUTES.USERS.ROOT,
    icon: Users,
    permission: "user_management",
  },
  {
    name: "Price Lists",
    href: ROUTES.PRICE_LISTS.ROOT,
    icon: ReceiptText,
    adminOnly: true,
  },
];

export const BOTTOM_NAVIGATION_ITEMS: NavItem[] = [
  { name: "Settings", href: ROUTES.SETTINGS, icon: Settings },
];
