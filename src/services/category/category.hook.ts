import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "./category.service";
import { toast } from "sonner";
import { CategoryPayload } from "@/types/category/category.types";

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (filters: any) => [...categoryKeys.lists(), { filters }] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

export const useCategories = (params?: {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
}) => {
  return useQuery({
    queryKey: categoryKeys.list(params || {}),
    queryFn: () => categoryService.list(params),
  });
};

export const useCategoryDetail = (id: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getDetail(id),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CategoryPayload) => categoryService.create(payload),
    onSuccess: (res) => {
      toast.success(res?.message || "Category created successfully!");
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create category");
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CategoryPayload>;
    }) => categoryService.update(id, payload),
    onSuccess: (res, variables) => {
      toast.success(res?.message || "Category updated successfully!");
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update category");
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: (res, id) => {
      toast.success(res?.message || "Category deleted successfully!");
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete category");
    },
  });
};
