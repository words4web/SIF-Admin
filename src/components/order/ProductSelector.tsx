"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Minus, Trash2, Search, Package } from "lucide-react";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Button } from "@/components/ui/button";
import { formatPrice, formatWeight } from "@/lib/format";
import { useProductCatalog } from "@/services/product/product.hook";
import { useCategories } from "@/services/category/category.hook";
import { SelectedOrderItem, ProductSelectorProps } from "@/types/order.types";
import { useDebounce } from "@/hooks/useDebounce";

export function ProductSelector({
  selectedItems,
  onAddItem,
  onUpdateQuantity,
  onRemoveItem,
}: ProductSelectorProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedWeightMap, setSelectedWeightMap] = useState<
    Record<string, number>
  >({});

  const debouncedSearch = useDebounce(search.trim(), 300);
  const hasSearch = debouncedSearch.length >= 2;
  const hasCategory = Boolean(selectedCategory);
  const shouldFetch = hasSearch || hasCategory;

  const { data: categoriesResponse } = useCategories({ isActive: true });
  const rawCatData = categoriesResponse?.data;
  const categories: any[] = Array.isArray(rawCatData)
    ? rawCatData
    : rawCatData?.categories || [];

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((c) => ({
      value: c._id,
      label: c.name,
    })),
  ];

  const { data: productsResponse, isFetching } = useProductCatalog(
    {
      search: debouncedSearch || undefined,
      categoryId: selectedCategory || undefined,
      limit: 50,
    },
    shouldFetch,
  );

  const rawData = productsResponse?.data;
  const products: any[] = Array.isArray(rawData)
    ? rawData
    : rawData?.products || [];

  const getEffectiveVariant = (prod: any) => {
    const variants = Array.isArray(prod?.variants) ? prod?.variants : [];
    if (variants?.length === 0) return null;
    const selectedWeight = selectedWeightMap[prod?._id];
    if (selectedWeight) {
      const found = variants?.find((v: any) => v?.weight === selectedWeight);
      if (found) return found;
    }
    return variants[0];
  };

  const getItemQuantity = (productId: string, weight?: number) => {
    const item = selectedItems?.find(
      (i) =>
        i?.productId === productId && (weight ? i?.weight === weight : true),
    );
    return item ? item.quantity : 0;
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-5 shadow-sm">
      <div className="flex items-center gap-2.5 pb-3 border-b border-border">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Package className="size-4.5" />
        </div>
        <div>
          <h2 className="font-serif text-base font-bold text-foreground">
            Select Wholesale Products
          </h2>
          <p className="text-xs text-muted-foreground">
            Search and add products to this order
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <Input
            placeholder="Search products by name or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="sm:col-span-1">
          <Select
            value={selectedCategory}
            options={categoryOptions}
            placeholder="All Categories"
            onChange={(e) => setSelectedCategory(e.target.value)}
          />
        </div>
      </div>

      {!shouldFetch ? (
        <div className="py-8 text-center rounded-xl border border-dashed border-border/80 bg-secondary/20">
          <Search className="size-6 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-xs font-semibold text-foreground">
            Search products to add
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Type a product name, keyword, or pick a category above.
          </p>
        </div>
      ) : search.trim().length > 0 &&
        search.trim().length < 2 &&
        !hasCategory ? (
        <div className="py-6 text-center text-xs text-muted-foreground">
          Type at least 2 characters to search...
        </div>
      ) : isFetching ? (
        <div className="py-8 text-center text-xs text-muted-foreground">
          Searching catalog...
        </div>
      ) : products.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground">
          No active products found matching your filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
          {products?.map((prod: any) => {
            const variants = Array.isArray(prod?.variants)
              ? prod?.variants
              : [];
            const activeVariant = getEffectiveVariant(prod);
            const activeWeight = activeVariant?.weight;
            const activePrice = activeVariant?.price ?? prod?.price ?? 0;
            const currentQty = getItemQuantity(prod?._id, activeWeight);
            const imageSrc =
              Array.isArray(prod.images) && prod.images.length > 0
                ? prod.images[0]
                : null;

            return (
              <div
                key={prod._id}
                className="flex flex-col justify-between gap-3 p-3 rounded-xl border border-border/80 bg-background hover:border-border transition-colors">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="relative size-12 rounded-lg bg-secondary shrink-0 overflow-hidden flex items-center justify-center border border-border/60 mt-0.5">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={prod.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <Package className="size-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground truncate">
                      {prod.name}
                    </p>
                    <p className="text-[11px] font-bold text-primary mt-0.5">
                      {formatPrice(activePrice)}
                      {activeWeight ? (
                        <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                          ({formatWeight(activeWeight)})
                        </span>
                      ) : null}
                    </p>

                    {variants.length > 1 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {variants.map((v: any) => {
                          const isSelected =
                            (activeWeight || variants[0]?.weight) === v.weight;
                          return (
                            <button
                              key={v.weight}
                              type="button"
                              onClick={() =>
                                setSelectedWeightMap((prev) => ({
                                  ...prev,
                                  [prod._id]: v.weight,
                                }))
                              }
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                                isSelected
                                  ? "bg-primary text-primary-foreground shadow-xs"
                                  : "bg-muted text-muted-foreground hover:text-foreground"
                              }`}>
                              {formatWeight(v.weight)}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end pt-1 border-t border-border/40">
                  {currentQty === 0 ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        onAddItem(prod, activeVariant || undefined)
                      }
                      className="h-7 px-2.5 text-xs shrink-0 font-bold">
                      <Plus className="size-3.5 mr-1" /> Add
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        size="icon-sm"
                        variant="outline"
                        onClick={() =>
                          onUpdateQuantity(
                            prod._id,
                            activeWeight,
                            currentQty - 1,
                          )
                        }
                        className="size-6 rounded-md">
                        <Minus className="size-3" />
                      </Button>
                      <span className="text-xs font-mono font-bold w-6 text-center">
                        {currentQty}
                      </span>
                      <Button
                        size="icon-sm"
                        variant="outline"
                        onClick={() =>
                          onUpdateQuantity(
                            prod._id,
                            activeWeight,
                            currentQty + 1,
                          )
                        }
                        className="size-6 rounded-md">
                        <Plus className="size-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedItems.length > 0 && (
        <div className="pt-3 border-t border-border space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-foreground">
              Selected Order Items ({selectedItems.length})
            </h3>
          </div>

          <div className="divide-y divide-border/60 rounded-xl border border-border bg-background overflow-hidden">
            {selectedItems.map((item) => {
              const itemTotal = item.price * item.quantity;
              return (
                <div
                  key={`${item.productId}-${item.weight || 0}`}
                  className="flex items-center justify-between p-3 gap-3 text-xs">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-foreground truncate">
                        {item.name}
                      </p>
                      {item.weight ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-primary/10 text-primary border border-primary/20">
                          {formatWeight(item.weight)}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {formatPrice(item.price)} each
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() =>
                          onUpdateQuantity(
                            item.productId,
                            item.weight,
                            item.quantity - 1,
                          )
                        }
                        className="size-6 rounded-md hover:bg-muted">
                        <Minus className="size-3" />
                      </Button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val) && val >= 1) {
                            onUpdateQuantity(item.productId, item.weight, val);
                          }
                        }}
                        className="w-10 text-center font-mono font-semibold text-xs border border-border rounded py-0.5 bg-card"
                      />
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() =>
                          onUpdateQuantity(
                            item.productId,
                            item.weight,
                            item.quantity + 1,
                          )
                        }
                        className="size-6 rounded-md hover:bg-muted">
                        <Plus className="size-3" />
                      </Button>
                    </div>

                    <div className="w-20 text-right font-serif font-bold text-foreground">
                      {formatPrice(itemTotal)}
                    </div>

                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => onRemoveItem(item.productId, item.weight)}
                      className="size-7 text-destructive hover:bg-destructive/10">
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
