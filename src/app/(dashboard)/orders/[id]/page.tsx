"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/Loader";
import { ErrorView } from "@/components/common/ErrorView";
import {
  useAdminOrderDetailQuery,
  useUpdateOrderStatusMutation,
} from "@/services/order/order.hook";
import { ROUTES } from "@/constants/routes";
import { OrderHeader } from "@/components/order/order-header";
import { OrderCustomerDetails } from "@/components/order/order-customer-details";
import { OrderItemsTable } from "@/components/order/order-items-table";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const {
    data: responseBody,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminOrderDetailQuery(orderId);

  const updateStatusMutation = useUpdateOrderStatusMutation();

  const order = responseBody?.data;

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push(ROUTES.ORDERS.ROOT)}
          className="inline-flex items-center gap-2 text-sm font-semibold">
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Button>
        <ErrorView
          message={error?.message || "Order details not found"}
          onRetry={refetch}
        />
      </div>
    );
  }

  const isDelivered = order.status === "DELIVERED";

  const handleUpdateStatus = (newStatus: "DELIVERED" | "IN_PROCESS") => {
    updateStatusMutation.mutate({
      id: order._id,
      status: newStatus,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push(ROUTES.ORDERS.ROOT)}
          className="inline-flex items-center gap-2 text-sm font-semibold -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Button>
      </div>

      <OrderHeader
        orderId={order?.orderId}
        createdAt={order?.createdAt}
        status={order?.status}
        total={order?.total}
        isDelivered={isDelivered}
        isUpdating={updateStatusMutation.isPending}
        invoiceUrl={order?.invoiceUrl}
        deliveryNoteUrl={order?.deliveryNoteUrl}
        onUpdateStatus={handleUpdateStatus}
      />

      <OrderCustomerDetails delivery={order?.delivery} userId={order?.userId} />

      <OrderItemsTable
        items={order?.items || []}
        subtotal={order?.subtotal}
        vat={order?.vat}
        total={order?.total}
      />
    </div>
  );
}
