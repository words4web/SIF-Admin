import { useState } from "react";
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  FileText,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/common/ConfirmModal";

import { OrderHeaderProps } from "@/types/order.types";

export function OrderHeader({
  orderId,
  createdAt,
  total,
  isDelivered,
  isUpdating,
  deliveryNoteUrl,
  invoiceUrl,
  onUpdateStatus,
}: OrderHeaderProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <ShoppingBag className="size-6 text-primary" />
              Order #{orderId}
            </h1>
            {isDelivered ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" />
                Delivered
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                <Clock className="size-3.5 animate-spin" />
                In Process
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Placed on{" "}
            <span className="font-medium text-foreground">
              {createdAt
                ? new Date(createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A"}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {invoiceUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.open(invoiceUrl, "_blank", "noopener,noreferrer")
              }
              className="gap-1.5 font-semibold text-xs h-9 cursor-pointer">
              <FileText className="size-3.5 text-primary" />
              Invoice
            </Button>
          )}

          {!isDelivered && (
            <Button
              size="sm"
              disabled={isUpdating}
              onClick={() => setShowConfirmModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm cursor-pointer h-9">
              {isUpdating ? "Updating…" : "Mark as Delivered"}
            </Button>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => onUpdateStatus("DELIVERED")}
        title="Mark Order as Delivered"
        description={`Are you sure you want to mark Order #${orderId} as Delivered? This will confirm that the delivery has been completed.`}
        confirmText="Confirm Delivery"
        cancelText="Cancel"
      />
    </>
  );
}
