"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Package } from "lucide-react";
import { toast } from "sonner";
import { ProductModalPicker } from "@/components/common/ProductModalPicker";
import { ROUTES } from "@/constants/routes";
import { formatPounds } from "@/lib/format";
import {
  SelectedProductRow,
  PriceListFormProps,
} from "@/types/priceList.types";

const EMPTY_PRODUCTS: SelectedProductRow[] = [];

export function PriceListForm({
  initialName = "",
  initialProducts = EMPTY_PRODUCTS,
  onSubmit,
  isPending = false,
  submitLabel = "Save Price List",
  pendingLabel = "Saving...",
}: PriceListFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [selectedProducts, setSelectedProducts] =
    useState<SelectedProductRow[]>(initialProducts);
  const [showProductPicker, setShowProductPicker] = useState(false);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const productsJson = JSON.stringify(initialProducts);
  useEffect(() => {
    setSelectedProducts(initialProducts);
  }, [productsJson]);

  const handleAddProduct = (prod: any) => {
    const existing = selectedProducts.find((p) => p.productId === prod._id);
    if (existing) {
      toast.info(`"${prod.name}" is already added.`);
      return;
    }

    setSelectedProducts((prev) => [
      ...prev,
      {
        productId: prod._id,
        name: prod.name,
        pack: prod.pack,
        basePrice: prod.price || 0,
        customPrice: prod.price || 0,
        images: prod.images,
      },
    ]);
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.filter((p) => p.productId !== productId),
    );
  };

  const handleCustomPriceChange = (productId: string, value: number) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.productId === productId
          ? { ...p, customPrice: Math.max(0, value) }
          : p,
      ),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please provide a name for the price list.");
      return;
    }

    onSubmit({
      name: name.trim(),
      products: selectedProducts.map((p) => ({
        productId: p.productId,
        price: Number(p.customPrice) || 0,
      })),
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-foreground">
            Basic Details
          </h2>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Price List Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Supermarket Gold Tier, Milan Key Accounts"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
            <div>
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Package className="size-4 text-primary" />
                Products &amp; Custom Prices ({selectedProducts.length})
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Products added here will be sold at the custom price for
                assigned customers.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowProductPicker(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors self-start sm:self-auto">
              <Plus className="size-3.5" /> Add Products
            </button>
          </div>

          {selectedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 py-10 text-center">
              <Package className="size-10 text-muted-foreground/50 mb-2" />
              <p className="text-sm font-medium text-foreground">
                No products added yet
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-sm">
                Click &quot;Add Products&quot; to pick items and set custom
                wholesale rates.
              </p>
              <button
                type="button"
                onClick={() => setShowProductPicker(true)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors">
                <Plus className="size-3.5" /> Select Products
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border/60 text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3">Pack</th>
                    <th className="py-2.5 px-3">Base Price</th>
                    <th className="py-2.5 px-3 w-40">Custom Price (€)</th>
                    <th className="py-2.5 px-3 text-right">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {selectedProducts?.map((p) => {
                    const diff = p?.customPrice - p?.basePrice;
                    return (
                      <tr
                        key={p.productId}
                        className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 px-3 font-medium text-foreground">
                          {p.name}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">
                          {p.pack}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">
                          {formatPounds(p.basePrice)}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={p.customPrice}
                              onChange={(e) =>
                                handleCustomPriceChange(
                                  p.productId,
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              className="w-24 rounded-lg border border-input bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                              required
                            />
                            {diff !== 0 && (
                              <span
                                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                  diff < 0
                                    ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400"
                                    : "text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400"
                                }`}>
                                {diff < 0
                                  ? `${diff.toFixed(2)}€`
                                  : `+${diff.toFixed(2)}€`}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(p.productId)}
                            className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                            aria-label="Remove item">
                            <Trash2 className="size-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push(ROUTES.PRICE_LISTS.ROOT)}
            className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors disabled:opacity-50">
            {isPending ? pendingLabel : submitLabel}
          </button>
        </div>
      </form>

      <ProductModalPicker
        isOpen={showProductPicker}
        onClose={() => setShowProductPicker(false)}
        selectedProductIds={selectedProducts.map((p) => p.productId)}
        onAddProduct={handleAddProduct}
        onRemoveProduct={handleRemoveProduct}
      />
    </>
  );
}
