"use client";

import { FileText, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/common/Textarea";
import { formatPounds } from "@/lib/format";
import { SelectedOrderItem, OrderSummaryCardProps } from "@/types/order.types";

export function OrderSummaryCard({
  selectedItems,
  notes,
  onNotesChange,
  onSubmitOrder,
  isValid,
  isSubmitting,
}: OrderSummaryCardProps) {
  const subtotal = (selectedItems || [])?.reduce((acc, item) => {
    const price = item?.price ?? 0;
    const quantity = item?.quantity ?? 0;
    return acc + price * quantity;
  }, 0);
  const total = subtotal;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-5 shadow-sm sticky top-6">
      <div className="flex items-center gap-2.5 pb-3 border-b border-border">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShoppingBag className="size-4.5" />
        </div>
        <div>
          <h2 className="font-serif text-base font-bold text-foreground">
            Order Summary
          </h2>
          <p className="text-xs text-muted-foreground">
            Price breakdown & delivery notes
          </p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Items ({selectedItems.length})</span>
          <span className="font-medium text-foreground">
            {selectedItems.reduce((sum, item) => sum + item.quantity, 0)} units
          </span>
        </div>

        <div className="flex items-center justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-mono font-medium text-foreground">
            {formatPounds(subtotal)}
          </span>
        </div>

        <div className="pt-3 border-t border-border flex items-baseline justify-between">
          <span className="font-serif font-bold text-base text-foreground">
            Grand Total
          </span>
          <span className="font-serif text-xl font-extrabold text-primary">
            {formatPounds(total)}
          </span>
        </div>
      </div>

      <div className="space-y-1.5 pt-2">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <FileText className="size-3.5 text-muted-foreground" />
          Delivery Notes (Optional)
        </label>
        <Textarea
          placeholder="Special delivery instructions or order references..."
          rows={3}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="text-xs"
        />
      </div>

      <Button
        onClick={onSubmitOrder}
        disabled={!isValid || isSubmitting}
        className="w-full h-11 text-sm font-bold shadow-lg shadow-primary/20">
        {isSubmitting ? "Creating Order..." : "Create Wholesale Order"}
      </Button>

      {!isValid && (
        <p className="text-[11px] text-center text-muted-foreground">
          Please select a customer, delivery address, and at least 1 product.
        </p>
      )}
    </div>
  );
}
