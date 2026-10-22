"use client";

import { CreditCard, Package } from "lucide-react";
import { formatPrice, formatWeight } from "@/lib/format";
import { DataTable, TableColumn } from "@/components/common/DataTable";
import { OrderItemsTableProps } from "@/types/order.types";

export function OrderItemsTable({
  items,
  subtotal,
  total,
  charges,
}: OrderItemsTableProps) {
  const columns: TableColumn<any>[] = [
    {
      key: "productName",
      header: "Product Name",
      className: "min-w-[380px] w-[45%]",
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
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-foreground">
                {typeof row?.productId?.name === "object"
                  ? row?.productId?.name?.en ||
                    row?.productId?.name?.it ||
                    "Product"
                  : row?.productId?.name || "Deleted Product"}
              </p>
              {row?.weight ? (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-extrabold bg-primary/10 text-primary border border-primary/20">
                  {formatWeight(row?.weight)}
                </span>
              ) : null}
            </div>
          </div>
        );
      },
    },
    {
      key: "pack",
      header: "Pack / Weight",
      render: (row) => (
        <span className="text-muted-foreground font-medium">
          {row?.weight
            ? formatWeight(row.weight)
            : row?.productId?.pack || "N/A"}
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
          {formatPrice(row?.price || 0)}
        </span>
      ),
    },
    {
      key: "totalPrice",
      header: "Total Price",
      render: (row) => (
        <span className="font-bold text-foreground">
          {formatPrice((row?.price || 0) * (row?.quantity || 0))}
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
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-semibold text-foreground">
              {formatPrice(subtotal || total)}
            </span>
          </div>
          {charges && charges?.length > 0
            ? charges?.map((charge, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-muted-foreground">
                  <span>{charge?.name}</span>
                  <span
                    className={
                      charge?.amount === 0
                        ? "text-emerald-600 dark:text-emerald-400 font-bold"
                        : "font-semibold text-foreground"
                    }>
                    {charge?.amount === 0
                      ? "FREE"
                      : formatPrice(charge?.amount)}
                  </span>
                </div>
              ))
            : null}
          <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
            <span className="text-foreground">Total Order Amount</span>
            <span className="text-primary font-serif text-xl font-extrabold">
              {formatPrice(total || subtotal)}
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
        <DataTable
          columns={columns}
          data={items || []}
          keyExtractor={(row, index) =>
            `${row?.productId?._id || "item"}-${row?.weight || index}-${index}`
          }
          emptyMessage="No items found in this order."
        />
      </div>
    </div>
  );
}
