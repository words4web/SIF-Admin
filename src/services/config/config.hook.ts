import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { configService } from "./config.service";
import { IUpdateConfigPayload } from "@/types/config/config.types";

export const useAdminConfigQuery = () => {
  return useQuery({
    queryKey: ["admin", "configs"],
    queryFn: () => configService.getConfig(),
  });
};

export const useUpdateAdminConfigMutation = (options?: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IUpdateConfigPayload) =>
      configService.updateConfig(payload),
    onSuccess: () => {
      toast.success("Configuration updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "configs"] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update configuration",
      );
    },
  });
};
