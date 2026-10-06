import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { salesmanService } from "./salesman.service";
import {
  SalesmanPermission,
  SalesmanQueryParams,
} from "@/types/salesman.types";
import { toast } from "sonner";

export const salesmanKeys = {
  all: ["admin", "salesmen"] as const,
  lists: () => [...salesmanKeys.all, "list"] as const,
  list: (params?: SalesmanQueryParams) =>
    [...salesmanKeys.lists(), params || {}] as const,
  details: () => [...salesmanKeys.all, "detail"] as const,
  detail: (id: string) => [...salesmanKeys.details(), id] as const,
};

export const useSalesmen = (params?: SalesmanQueryParams, enabled = true) => {
  return useQuery({
    queryKey: salesmanKeys.list(params),
    queryFn: () => salesmanService.getSalesmen(params),
    placeholderData: keepPreviousData,
    enabled,
  });
};

export const useSalesmanDetail = (id: string, enabled = true) => {
  return useQuery({
    queryKey: salesmanKeys.detail(id),
    queryFn: () => salesmanService.getSalesmanById(id),
    enabled: enabled && !!id,
  });
};

export const useCreateSalesman = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      fullName: string;
      email: string;
      password: string;
      permissions: SalesmanPermission[];
    }) => salesmanService.createSalesman(data),
    onSuccess: (res) => {
      toast.success(res?.message || "Salesman account created successfully!");
      queryClient.invalidateQueries({ queryKey: salesmanKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create salesman");
    },
  });
};

export const useUpdateSalesman = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { fullName?: string; permissions?: SalesmanPermission[] };
    }) => salesmanService.updateSalesman(id, data),
    onSuccess: (res, variables) => {
      toast.success(res?.message || "Salesman updated successfully!");
      queryClient.invalidateQueries({ queryKey: salesmanKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: salesmanKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update salesman");
    },
  });
};

export const useUpdateSalesmanStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      salesmanService.updateSalesmanStatus(id, isActive),
    onSuccess: (res, variables) => {
      toast.success(
        res?.message ||
          `Salesman ${variables.isActive ? "activated" : "deactivated"} successfully!`,
      );
      queryClient.invalidateQueries({ queryKey: salesmanKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: salesmanKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update salesman status",
      );
    },
  });
};
