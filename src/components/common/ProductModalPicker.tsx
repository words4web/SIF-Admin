"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Search, Plus, Check, Loader2, X } from "lucide-react";
import { formatPounds } from "@/lib/format";
import { productService } from "@/services/product/product.service";
import { useDebounce } from "@/hooks/useDebounce";

export interface ProductModalPickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProductIds: string[];
  onAddProduct: (product: any) => void;
  onRemoveProduct: (productId: string) => void;
}

const PAGE_LIMIT = 20;

export function ProductModalPicker({
  isOpen,
  onClose,
  selectedProductIds,
  onAddProduct,
  onRemoveProduct,
}: ProductModalPickerProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 350);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["admin", "products", "modal-picker", debouncedSearch],
      queryFn: ({ pageParam = 1 }) =>
        productService.list({
          search: debouncedSearch || undefined,
          page: pageParam,
          limit: PAGE_LIMIT,
          isActive: true,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage: any, allPages) => {
        const total = lastPage?.data?.total || 0;
        const currentLoaded = allPages.reduce(
          (sum, p) => sum + (p?.data?.products?.length || 0),
          0,
        );
        return currentLoaded < total ? allPages.length + 1 : undefined;
      },
      enabled: isOpen,
    });

  const products =
    data?.pages.flatMap((page: any) => page?.data?.products || []) || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in-50">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-5 shadow-xl space-y-4 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <h3 className="text-base font-semibold text-foreground">
            Select Products
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground">
            Done
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-input bg-background pl-9 pr-9 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            autoFocus
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground">
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border/40 min-h-[250px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-xs text-muted-foreground gap-2">
              <Loader2 className="size-4 animate-spin text-primary" />
              <span>Loading products...</span>
            </div>
          ) : products?.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No products found matching your search.
            </div>
          ) : (
            <>
              {products?.map((prod: any) => {
                const isAdded = selectedProductIds?.includes(prod?._id);
                return (
                  <div
                    key={prod?._id}
                    className="flex items-center justify-between py-2.5 px-2 hover:bg-muted/40 rounded-lg transition-colors">
                    <div className="min-w-0 pr-3">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {prod?.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {prod?.pack ? `${prod?.pack} • ` : ""}Base:{" "}
                        {formatPounds(prod?.price || 0)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        isAdded
                          ? onRemoveProduct(prod?._id)
                          : onAddProduct(prod)
                      }
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        isAdded
                          ? "bg-primary text-primary-foreground"
                          : "border border-border hover:bg-muted text-foreground"
                      }`}>
                      {isAdded ? (
                        <>
                          <Check className="size-3" /> Added
                        </>
                      ) : (
                        <>
                          <Plus className="size-3" /> Add
                        </>
                      )}
                    </button>
                  </div>
                );
              })}

              {hasNextPage && (
                <div className="pt-3 pb-1 text-center">
                  <button
                    type="button"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50">
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin text-primary" />
                        <span>Loading more...</span>
                      </>
                    ) : (
                      <span>Load More Products</span>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="pt-2 border-t border-border/60 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {selectedProductIds?.length} product(s) selected
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
