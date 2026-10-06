"use client";

import { useState } from "react";
import Link from "next/link";
import { ReceiptText, Tag, Eye, Check } from "lucide-react";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import { usePriceListsLeanQuery } from "@/services/priceList/priceList.hook";
import { useUpdateUserPriceListMutation } from "@/services/user/user.hook";
import { UserPriceListSectionProps } from "@/types/priceList.types";

export function UserPriceListSection({
  userId,
  userName = "User",
  assignedPriceList,
  onSuccess,
}: UserPriceListSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedPriceListId, setSelectedPriceListId] = useState<string | null>(
    null,
  );

  const { data: priceListsData, isFetching: isFetchingPriceLists } =
    usePriceListsLeanQuery(showModal);

  const availablePriceLists = priceListsData?.data || [];
  const updatePriceListMutation = useUpdateUserPriceListMutation();

  const handleOpenModal = () => {
    setSelectedPriceListId(
      assignedPriceList ? assignedPriceList._id || assignedPriceList : null,
    );
    setShowModal(true);
  };

  const handleSavePriceList = () => {
    updatePriceListMutation.mutate(
      { id: userId, priceListId: selectedPriceListId },
      {
        onSuccess: () => {
          toast.success("Customer price list updated successfully.");
          setShowModal(false);
          onSuccess?.();
        },
        onError: (err: any) => {
          toast.error(
            err.response?.data?.message || "Failed to update price list.",
          );
        },
      },
    );
  };

  return (
    <>
      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ReceiptText className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Custom Price List Assignment
              </h3>
              <p className="text-xs text-muted-foreground">
                {assignedPriceList
                  ? `Assigned to ${assignedPriceList.name}`
                  : "Using default catalog pricing (no custom overrides)"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenModal}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted shadow-xs transition-colors self-start sm:self-auto">
            <Tag className="size-3.5 text-primary" />
            {assignedPriceList ? "Change Price List" : "Assign Price List"}
          </button>
        </div>

        {assignedPriceList && (
          <div className="mt-2 p-3 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between">
            <div>
              <Link
                href={ROUTES.PRICE_LISTS.DETAIL(
                  assignedPriceList._id || assignedPriceList,
                )}
                className="text-xs font-semibold text-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
                <span>{assignedPriceList.name}</span>
                <Eye className="size-3 text-muted-foreground" />
              </Link>
            </div>
            <span className="rounded-full bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/20">
              Active Custom Pricing
            </span>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in-50">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <h3 className="text-base font-semibold text-foreground">
                Select Price List for {userName}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-xs text-muted-foreground hover:text-foreground">
                Cancel
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              <div
                onClick={() => setSelectedPriceListId(null)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                  selectedPriceListId === null
                    ? "border-primary bg-primary/5"
                    : "border-border/70 hover:bg-muted/30"
                }`}>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    None (Default Catalog Pricing)
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Customer sees standard prices.
                  </p>
                </div>
                {selectedPriceListId === null && (
                  <Check className="size-4 text-primary" />
                )}
              </div>

              {isFetchingPriceLists ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  Loading price lists...
                </div>
              ) : availablePriceLists?.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  No price lists found. Create one first.
                </div>
              ) : (
                availablePriceLists?.map(
                  (pl: { _id: string; name: string }) => {
                    const isSelected = selectedPriceListId === pl._id;
                    return (
                      <div
                        key={pl._id}
                        onClick={() => setSelectedPriceListId(pl._id)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-xs"
                            : "border-border/70 hover:bg-muted/30"
                        }`}>
                        <p className="text-xs font-semibold text-foreground">
                          {pl.name}
                        </p>
                        {isSelected && (
                          <Check className="size-4 text-primary shrink-0" />
                        )}
                      </div>
                    );
                  },
                )
              )}
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-border px-3.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePriceList}
                disabled={updatePriceListMutation.isPending}
                className="rounded-xl bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 disabled:opacity-50">
                {updatePriceListMutation.isPending
                  ? "Saving..."
                  : "Save Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
