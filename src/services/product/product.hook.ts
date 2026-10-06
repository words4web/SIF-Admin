import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { productService } from "./product.service";
import { ProductPayload } from "@/types/product/product.types";
import { toast } from "sonner";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: any) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export const useProducts = (
  params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    isActive?: boolean;
    search?: string;
  },
  enabled = true,
) => {
  return useQuery({
    queryKey: productKeys.list(params || {}),
    queryFn: () => productService.list(params),
    placeholderData: keepPreviousData,
    enabled,
  });
};

export const useProductCatalog = (
  params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    search?: string;
  },
  enabled = true,
) => {
  return useQuery({
    queryKey: ["admin", "products", "catalog", params || {}],
    queryFn: () => productService.getCatalog(params),
    placeholderData: keepPreviousData,
    enabled,
  });
};

export const useProductDetail = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getDetail(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductPayload) => productService.create(payload),
    onSuccess: (res) => {
      toast.success(res?.message || "Product created successfully!");
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create product");
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<ProductPayload>;
    }) => productService.update(id, payload),
    onSuccess: (res, variables) => {
      toast.success(res?.message || "Product updated successfully!");
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update product");
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: (res, id) => {
      toast.success(res?.message || "Product deleted successfully!");
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete product");
    },
  });
};
