"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  useSalesmen,
  useSalesmanDetail,
  useCreateSalesman,
  useUpdateSalesman,
  useUpdateSalesmanStatus,
} from "@/services/salesman/salesman.hook";
import { useSalesmanFilters } from "@/hooks/useSalesmanFilters";
import { SalesmanFormValues } from "@/types/salesmanForm.types";
import { ISalesman } from "@/types/salesman.types";
import { ROUTES } from "@/constants/routes";

interface UseSalesmanOptions {
  id?: string;
  mode?: "list" | "create" | "edit";
  limit?: number;
}

export function useSalesman({
  id,
  mode = "create",
  limit = 10,
}: UseSalesmanOptions = {}) {
  const router = useRouter();
  const filters = useSalesmanFilters();

  const listQuery = useSalesmen(
    {
      page: filters.page,
      limit,
      search: filters.search?.trim() || undefined,
    },
    mode === "list",
  );

  const detailQuery = useSalesmanDetail(
    id || "",
    Boolean(id && mode === "edit"),
  );

  const createMutation = useCreateSalesman();
  const updateMutation = useUpdateSalesman();
  const updateStatusMutation = useUpdateSalesmanStatus();

  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [statusConfirm, setStatusConfirm] = useState<{
    id: string;
    fullName?: string;
    currentStatus: boolean;
  } | null>(null);
  const [pendingValues, setPendingValues] = useState<SalesmanFormValues | null>(
    null,
  );

  useEffect(() => {
    if (mode === "list") return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isFormDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isFormDirty, mode]);

  const handleBack = useCallback(() => {
    if (isFormDirty) {
      setShowDiscardModal(true);
    } else {
      router.back();
    }
  }, [isFormDirty, router]);

  const handleConfirmDiscard = () => {
    setShowDiscardModal(false);
    router.back();
  };

  const handleSubmitForm = (values: SalesmanFormValues) => {
    setPendingValues(values);
    setShowSaveModal(true);
  };

  const handleConfirmSave = () => {
    if (!pendingValues) return;

    if (mode === "create") {
      if (!pendingValues.email || !pendingValues.password) return;
      createMutation.mutate(
        {
          fullName: pendingValues.fullName.trim(),
          email: pendingValues.email.trim().toLowerCase(),
          password: pendingValues.password,
          permissions: pendingValues.permissions,
        },
        {
          onSuccess: () => {
            setShowSaveModal(false);
            setIsFormDirty(false);
            router.push(ROUTES.SALESMEN.ROOT);
          },
          onError: () => {
            setShowSaveModal(false);
          },
        },
      );
    } else if (mode === "edit" && id) {
      updateMutation.mutate(
        {
          id,
          data: {
            fullName: pendingValues.fullName.trim(),
            permissions: pendingValues.permissions,
          },
        },
        {
          onSuccess: () => {
            setShowSaveModal(false);
            setIsFormDirty(false);
            router.push(ROUTES.SALESMEN.ROOT);
          },
          onError: () => {
            setShowSaveModal(false);
          },
        },
      );
    }
  };

  const handleToggleStatus = (targetId?: string, currentStatus?: boolean) => {
    const activeId = targetId || id;
    const activeStatus =
      currentStatus !== undefined
        ? currentStatus
        : detailQuery.data?.data?.isActive;

    if (!activeId || activeStatus === undefined) return;

    updateStatusMutation.mutate(
      { id: activeId, isActive: !activeStatus },
      {
        onSuccess: () => {
          setStatusConfirm(null);
        },
        onError: () => {
          setStatusConfirm(null);
        },
      },
    );
  };

  const salesmen: ISalesman[] = listQuery.data?.data || [];
  const meta = listQuery.data?.meta || { totalPages: 1, total: 0 };
  const total = meta?.total || salesmen.length;
  const totalPages = meta?.totalPages || Math.ceil(total / limit) || 1;

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isBusy = isSaving || updateStatusMutation.isPending;

  return {
    salesmen,
    total,
    totalPages,
    isFetching: listQuery.isFetching,

    salesman: detailQuery.data?.data,
    isLoading: mode === "list" ? listQuery.isLoading : detailQuery.isLoading,
    isError: mode === "list" ? listQuery.isError : detailQuery.isError,
    error: mode === "list" ? listQuery.error : detailQuery.error,
    refetch: mode === "list" ? listQuery.refetch : detailQuery.refetch,

    filters,

    isFormDirty,
    setIsFormDirty,
    pendingValues,
    isSaving,
    isBusy,
    isUpdatingStatus: updateStatusMutation.isPending,

    showDiscardModal,
    setShowDiscardModal,
    showSaveModal,
    setShowSaveModal,
    statusConfirm,
    setStatusConfirm,

    handleBack,
    handleConfirmDiscard,
    handleSubmitForm,
    handleConfirmSave,
    handleToggleStatus,
  };
}
