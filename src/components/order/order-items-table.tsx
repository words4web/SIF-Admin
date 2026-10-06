"use client";

import { CreditCard, Package } from "lucide-react";
import { formatPounds } from "@/lib/format";
import { DataTable, TableColumn } from "@/components/common/DataTable";
import { OrderItemsTableProps } from "@/types/order.types";

export function OrderItemsTable({
  items,
  subtotal,
  vat,
  total,
}: OrderItemsTableProps) {
  const columns: TableColumn<any>[] = [
    {
      key: "productName",
      header: "Product Name",
      className: "min-w-[380px] w-[40%]",
      render: (row) => {
        const imageUrl = row?.productId?.images?.[0];
        return (
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg border border-border/80 bg-muted/40 overflow-hidden flex items-center justify-center shrink-0">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={row?.productId?.name || "Product"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="size-4 text-muted-foreground/60" />
              )}
            </div>
            <p className="font-semibold text-foreground">
              {row?.productId?.name || "Deleted Product"}
            </p>
          </div>
        );
      },
    },
    {
      key: "pack",
      header: "Pack Size",
      render: (row) => (
        <span className="text-muted-foreground font-medium">
          {row?.productId?.pack || "N/A"}
        </span>
      ),
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (row) => (
        <span className="inline-flex items-center justify-center min-w-8 px-2 py-0.5 rounded-md bg-muted font-bold text-foreground">
          {row?.quantity}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price at Order",
      render: (row) => (
        <span className="font-medium text-muted-foreground">
          {formatPounds(row?.price || 0)}
        </span>
      ),
    },
    {
      key: "tax",
      header: "Tax (VAT)",
      render: (row) => {
        const isVat = row?.isVatApplicable ?? false;
        const itemSubtotal = (row?.price || 0) * (row?.quantity || 0);
        const itemVat = isVat ? itemSubtotal * 0.2 : 0;

        if (!isVat || itemVat === 0) {
          return <span className="text-muted-foreground font-medium">N/A</span>;
        }

        return (
          <span className="font-medium text-foreground">
            {formatPounds(itemVat)}
          </span>
        );
      },
    },
    {
      key: "totalPrice",
      header: "Total Price",
      render: (row) => (
        <span className="font-bold text-foreground">
          {formatPounds((row?.price || 0) * (row?.quantity || 0))}
        </span>
      ),
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden mb-8">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="size-5 text-primary" />
          <h2 className="font-serif text-lg font-bold text-foreground">
            Items Ordered ({items?.length || 0})
          </h2>
        </div>
      </div>

      <div className="bg-muted/30 p-6 flex flex-col items-end border-b border-border">
        <div className="w-full max-w-xs space-y-2.5 text-sm">
          <div className="flex justify-between text-white">
            <span>Subtotal</span>
            <span className="font-semibold text-foreground">
              {formatPounds(subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-white">
            <span>VAT (20%)</span>
            <span className="font-semibold text-foreground">
              {formatPounds(vat)}
            </span>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
            <span className="text-foreground">Total Order Amount</span>
            <span className="text-primary font-serif text-xl font-extrabold">
              {formatPounds(total)}
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
        <DataTable
          columns={columns}
          data={items || []}
          keyExtractor={(row, index) => row?.productId?._id || `item-${index}`}
          emptyMessage="No items found in this order."
        />
      </div>
    </div>
  );
}
