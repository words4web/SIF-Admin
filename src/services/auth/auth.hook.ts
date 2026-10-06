import { useMutation } from "@tanstack/react-query";
import { authService } from "./auth.service";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export const useLogin = (options?: {
  onSuccess?: (
    data: any,
    variables: { email: string; password?: string },
  ) => void;
}) => {
  const { signIn } = useAuth();
  return useMutation({
    mutationFn: (payload: { email: string; password?: string }) =>
      authService.login(payload),
    onSuccess: (res, variables) => {
      toast.success("Successfully logged in!");
      const accessToken = res?.data?.accessToken;
      const user = res?.data?.user;
      signIn(
        {
          id: user?.id,
          name: user?.fullName,
          email: user?.email,
          business: user?.businessName || "",
          role: user?.role,
          permissions: user?.permissions || [],
          addresses: user?.addresses || [],
        },
        accessToken,
      );
      options?.onSuccess?.(res, variables);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Sign in failed. Please check your credentials.",
      );
    },
  });
};
