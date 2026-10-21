"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { QueryBoundary } from "@/components/common/QueryBoundary";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { PriceListForm } from "@/components/common/PriceListForm";
import {
  usePriceListDetailQuery,
  useUpdatePriceListMutation,
  useDeletePriceListMutation,
} from "@/services/priceList/priceList.hook";
import { ROUTES } from "@/constants/routes";
import { PriceListFormData, SelectedProductRow } from "@/types/priceList.types";

export default function PriceListDetailPage() {
  const params = useParams();
  const router = useRouter();
  const priceListId = params?.id as string;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    data: detailResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = usePriceListDetailQuery(priceListId);

  const priceListData = detailResponse?.data;
  const priceList = priceListData?.priceList || priceListData;

  const updateMutation = useUpdatePriceListMutation();
  const deleteMutation = useDeletePriceListMutation();

  const initialProducts: SelectedProductRow[] = useMemo(() => {
    if (!priceList?.products) return [];
    return priceList.products.map((item: any) => {
      const prod = item.productId || {};
      const prodName =
        typeof prod?.name === "object"
          ? prod?.name?.en || prod?.name?.it || "Product"
          : prod?.name || "Product";

      const itemWeight =
        item.weight !== undefined && item.weight !== null
          ? Number(item.weight)
          : undefined;
      const matchedVariant =
        itemWeight && Array.isArray(prod?.variants)
          ? prod.variants.find((v: any) => Number(v.weight) === itemWeight)
          : null;

      const basePrice = matchedVariant
        ? (matchedVariant.price ?? 0)
        : Array.isArray(prod?.variants) && prod?.variants?.length > 0
          ? (prod?.variants[0]?.price ?? 0)
          : (prod?.price ?? 0);

      return {
        productId: typeof prod === "string" ? prod : prod._id,
        weight: itemWeight ?? (matchedVariant ? matchedVariant.weight : null),
        name: prodName,
        pack: prod.pack || "",
        basePrice,
        customPrice: item.price || 0,
        images: prod.images,
        variants: prod.variants,
      };
    });
  }, [priceList?.products]);

  const handleUpdate = (data: PriceListFormData) => {
    updateMutation.mutate({
      id: priceListId,
      payload: data,
    });
  };

  return (
    <QueryBoundary
      isLoading={isLoading}
      isError={isError}
      error={error}
      refetch={refetch}
      hasData={!!priceList}
      notFoundMessage="Price list not found.">
      <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
        <PageHeader
          title={priceList?.name || "Price List"}
          subtitle={`${initialProducts.length} custom product prices configured`}
          showBack
          backHref={ROUTES.PRICE_LISTS.ROOT}
          action={{
            label: "Delete Price List",
            icon: <Trash2 className="size-4 mr-1.5" />,
            variant: "destructive",
            onClick: () => setShowDeleteConfirm(true),
          }}
        />

        <PriceListForm
          initialName={priceList?.name || ""}
          initialProducts={initialProducts}
          onSubmit={handleUpdate}
          isPending={updateMutation.isPending}
          submitLabel="Save Product Pricing"
          pendingLabel="Saving..."
        />

        <ConfirmModal
          isOpen={showDeleteConfirm}
          title={`Delete "${priceList?.name}"?`}
          description="This will permanently delete this price list. Any customers assigned to this list will automatically revert to standard default catalog pricing."
          confirmText="Delete Price List"
          variant="destructive"
          isLoading={deleteMutation.isPending}
          onConfirm={() => {
            deleteMutation.mutate(priceListId, {
              onSuccess: () => {
                router.push(ROUTES.PRICE_LISTS.ROOT);
              },
            });
          }}
          onClose={() => setShowDeleteConfirm(false)}
        />
      </div>
    </QueryBoundary>
  );
}
