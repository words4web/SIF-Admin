import { useState } from "react";
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  XCircle,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { OrderHeaderProps, OrderStatus } from "@/types/order.types";

export function OrderHeader({
  orderId,
  createdAt,
  status = "IN_PROCESS",
  paymentStatus = "UNPAID",
  paymentMethod,
  total,
  isUpdating,
  deliveryNoteUrl,
  invoiceUrl,
  onUpdateStatus,
}: OrderHeaderProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const renderStatusBadge = () => {
    switch (status) {
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            Delivered
          </span>
        );
      case "PAYMENT_PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400">
            <Clock className="size-3.5" />
            Payment Pending
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/20 bg-destructive/10 px-3 py-0.5 text-xs font-bold text-destructive">
            <XCircle className="size-3.5" />
            Cancelled
          </span>
        );
      case "IN_PROCESS":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400">
            <Clock className="size-3.5 animate-spin" />
            In Process
          </span>
        );
    }
  };

  const renderPaymentBadge = () => {
    const paymentColors: Record<string, string> = {
      PAID: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      UNPAID: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      FAILED: "bg-destructive/10 text-destructive border-destructive/20",
      REQUIRES_REFUND: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    };
    const paymentLabels: Record<string, string> = {
      PAID: "Paid",
      UNPAID: "Unpaid",
      FAILED: "Payment Failed",
      REQUIRES_REFUND: "Refund Required",
    };
    const pStatus = paymentStatus || "UNPAID";
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-semibold ${
          paymentColors[pStatus] || "bg-secondary text-secondary-foreground"
        }`}>
        <CreditCard className="size-3" />
        {paymentLabels[pStatus] || pStatus}
      </span>
    );
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <ShoppingBag className="size-6 text-primary" />
              Order #{orderId}
            </h1>
            {renderStatusBadge()}
            {renderPaymentBadge()}
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

          {status === "IN_PROCESS" && (
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
        onConfirm={() => {
          setShowConfirmModal(false);
          onUpdateStatus("DELIVERED");
        }}
        title="Mark Order as Delivered"
        description={`Are you sure you want to mark Order #${orderId} as Delivered? This will confirm that the delivery has been completed.`}
        confirmText="Confirm Delivery"
        cancelText="Cancel"
        isLoading={isUpdating}
      />
    </>
  );
}
