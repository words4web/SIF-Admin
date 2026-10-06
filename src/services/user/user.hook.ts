import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService, UserQueryParams } from "./user.service";

export const USER_QUERY_KEYS = {
  all: ["admin", "users"] as const,
  list: (params?: UserQueryParams) =>
    ["admin", "users", "list", params] as const,
  detail: (id: string) => ["admin", "users", "detail", id] as const,
};

export const useUsersQuery = (params?: UserQueryParams, enabled = true) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.list(params),
    queryFn: () => userService.getUsers(params),
    enabled,
  });
};

export const useUserDetailQuery = (id: string, enabled = true) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: enabled && !!id,
  });
};

export const useUpdateUserStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      userService.updateUserStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEYS.detail(variables.id),
      });
    },
  });
};

export const useUpdateUserPriceListMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      priceListId,
    }: {
      id: string;
      priceListId: string | null;
    }) => userService.updateUserPriceList(id, priceListId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEYS.detail(variables.id),
      });
    },
  });
};
