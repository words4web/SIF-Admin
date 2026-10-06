import { SalesmanPermission } from "../salesman.types";

export enum EStaffRole {
  SUPER_ADMIN = "superAdmin",
  SUB_ADMIN = "subAdmin",
  SALESMAN = "SALESMAN",
}

export const STAFF_ROLE_LABELS: Record<string, string> = {
  [EStaffRole.SUPER_ADMIN]: "Super Administrator",
  [EStaffRole.SUB_ADMIN]: "Sub Administrator",
  [EStaffRole.SALESMAN]: "Salesman",
};

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  business?: string;
  role?: string;
  permissions?: SalesmanPermission[];
  addresses?: any[];
}

export interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
}

export interface AuthContextValue {
  user: AuthUser | null;
  ready: boolean;
  signIn: (user: AuthUser, token?: string) => void;
  signOut: () => void;
}
