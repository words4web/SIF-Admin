import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { priceListService, PriceListQueryParams } from "./priceList.service";
import {
  CreatePriceListPayload,
  UpdatePriceListPayload,
} from "@/types/priceList.types";
import { toast } from "sonner";
import { USER_QUERY_KEYS } from "../user/user.hook";

export const PRICE_LIST_QUERY_KEYS = {
  all: ["admin", "priceLists"] as const,
  lists: () => [...PRICE_LIST_QUERY_KEYS.all, "list"] as const,
  list: (params?: PriceListQueryParams) =>
    [...PRICE_LIST_QUERY_KEYS.lists(), params] as const,
  lean: () => [...PRICE_LIST_QUERY_KEYS.all, "lean"] as const,
  details: () => [...PRICE_LIST_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PRICE_LIST_QUERY_KEYS.details(), id] as const,
};

export const usePriceListsQuery = (
  params?: PriceListQueryParams,
  enabled = true,
) => {
  return useQuery({
    queryKey: PRICE_LIST_QUERY_KEYS.list(params),
    queryFn: () => priceListService.list(params),
    enabled,
  });
};

export const usePriceListsLeanQuery = (enabled = true) => {
  return useQuery({
    queryKey: PRICE_LIST_QUERY_KEYS.lean(),
    queryFn: () => priceListService.getAllLean(),
    enabled,
  });
};

export const usePriceListDetailQuery = (id: string, enabled = true) => {
  return useQuery({
    queryKey: PRICE_LIST_QUERY_KEYS.detail(id),
    queryFn: () => priceListService.getDetail(id),
    enabled: enabled && !!id,
  });
};

export const useCreatePriceListMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePriceListPayload) =>
      priceListService.create(payload),
    onSuccess: (res) => {
      toast.success(res?.message || "Price list created successfully!");
      queryClient.invalidateQueries({ queryKey: PRICE_LIST_QUERY_KEYS.all });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create price list",
      );
    },
  });
};

export const useUpdatePriceListMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdatePriceListPayload;
    }) => priceListService.update(id, payload),
    onSuccess: (res, variables) => {
      toast.success(res?.message || "Price list updated successfully!");
      queryClient.invalidateQueries({ queryKey: PRICE_LIST_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: PRICE_LIST_QUERY_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update price list",
      );
    },
  });
};

export const useDeletePriceListMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => priceListService.delete(id),
    onSuccess: (res, id) => {
      toast.success(res?.message || "Price list deleted successfully!");
      queryClient.invalidateQueries({ queryKey: PRICE_LIST_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: PRICE_LIST_QUERY_KEYS.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete price list",
      );
    },
  });
};
