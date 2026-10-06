export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  CATEGORIES: {
    ROOT: "/categories",
    NEW: "/categories/new",
    DETAIL: (id: string) => `/categories/${id}`,
    EDIT: (id: string) => `/categories/${id}/edit`,
  },
  ORDERS: {
    ROOT: "/orders",
    NEW: "/orders/new",
    DETAIL: (id: string) => `/orders/${id}`,
  },
  PRODUCTS: {
    ROOT: "/products",
    NEW: "/products/new",
    DETAIL: (id: string) => `/products/${id}`,
    EDIT: (id: string) => `/products/${id}/edit`,
  },
  USERS: {
    ROOT: "/users",
    DETAIL: (id: string) => `/users/${id}`,
  },
  PRICE_LISTS: {
    ROOT: "/price-lists",
    NEW: "/price-lists/new",
    DETAIL: (id: string) => `/price-lists/${id}`,
  },
  SALESMEN: {
    ROOT: "/salesmen",
    NEW: "/salesmen/new",
    DETAIL: (id: string) => `/salesmen/${id}`,
  },
  SETTINGS: "/settings",
  NOTIFICATIONS: "/notifications",
};

export const PROTECTED_ROUTES = [
  ROUTES.HOME,
  ROUTES.CATEGORIES.ROOT,
  ROUTES.ORDERS.ROOT,
  ROUTES.PRODUCTS.ROOT,
  ROUTES.USERS.ROOT,
  ROUTES.PRICE_LISTS.ROOT,
  ROUTES.SALESMEN.ROOT,
  ROUTES.SETTINGS,
  ROUTES.NOTIFICATIONS,
];

export const GUEST_ROUTES = [ROUTES.LOGIN];
