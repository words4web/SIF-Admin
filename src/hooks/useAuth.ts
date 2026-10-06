import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { clearAuth, setAuthUser, setAccessToken } from "@/store/authSlice";
import { AuthUser } from "@/types/auth/auth.types";
import { useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth/auth.service";
import { toast } from "sonner";

export const useProfile = (options?: { enabled?: boolean }) => {
  const { signIn } = useAuth();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const query = useQuery({
    queryKey: ["profile"],
    queryFn: () => authService.getProfile(),
    retry: false,
    ...options,
    enabled: !!accessToken && options?.enabled !== false,
  });

  const { data, isSuccess } = query;

  useEffect(() => {
    if (isSuccess && data?.data?.user) {
      const user = data?.data?.user;
      signIn({
        id: user?.id,
        name: user?.fullName,
        email: user?.email,
        business: user?.businessName || "",
        role: user?.role,
        permissions: user?.permissions || [],
        addresses: user?.addresses || [],
      });
    }
  }, [isSuccess, data, signIn]);

  return query;
};

export function useAuth() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const signIn = useCallback(
    (userData: AuthUser, token?: string) => {
      dispatch(setAuthUser(userData));
      if (token) {
        dispatch(setAccessToken(token));
      }
    },
    [dispatch],
  );

  const signOut = useCallback(async () => {
    try {
      await authService.logout();
      toast.success("Successfully logged out!");
    } catch (err: any) {
      console.error("Logout failed:", err);
      toast.error(err.response?.data?.message || "Logout failed.");
    } finally {
      dispatch(clearAuth());
      queryClient.clear();
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }
    }
  }, [dispatch, queryClient]);

  const ready = !accessToken || !!user;

  return {
    user,
    ready,
    signIn,
    signOut,
  };
}

export default useAuth;
