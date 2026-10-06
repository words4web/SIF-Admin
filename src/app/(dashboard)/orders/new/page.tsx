"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { CustomerSelector } from "@/components/order/CustomerSelector";
import { ProductSelector } from "@/components/order/ProductSelector";
import { OrderSummaryCard } from "@/components/order/OrderSummaryCard";
import { useCreateAdminOrderMutation } from "@/services/order/order.hook";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import { SelectedOrderItem } from "@/types/order.types";

export default function CreateOrderPage() {
  const router = useRouter();

  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<SelectedOrderItem[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const createOrderMutation = useCreateAdminOrderMutation({
    onSuccess: (data) => {
      const createdOrder = data?.data;
      if (createdOrder?._id) {
        router.push(ROUTES.ORDERS.DETAIL(createdOrder._id));
      } else {
        router.push(ROUTES.ORDERS.ROOT);
      }
    },
  });

  const handleSelectCustomer = (userId: string) => {
    setSelectedUserId(userId);
    setSelectedAddressId("");
  };

  const handleAddItem = (product: any) => {
    setSelectedItems((prev) => {
      const existing = prev.find((item) => item.productId === product._id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      const imageSrc =
        Array.isArray(product.images) && product.images.length > 0
          ? product.images[0]
          : undefined;

      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.price || 0,
          pack: product.pack,
          unit: product.unit,
          image: imageSrc,
          isVatApplicable: !!product.isVatApplicable,
          quantity: 1,
        },
      ];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const handleRemoveItem = (productId: string) => {
    setSelectedItems((prev) =>
      prev.filter((item) => item.productId !== productId),
    );
  };

  const isFormValid =
    !!selectedUserId &&
    !!selectedAddressId &&
    selectedItems.length > 0 &&
    selectedItems.every((item) => item.quantity > 0);

  const handleConfirmOrder = () => {
    if (!isFormValid) {
      toast.error("Please fill in all required order details.");
      return;
    }

    createOrderMutation.mutate({
      userId: selectedUserId,
      addressId: selectedAddressId,
      items: selectedItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      <PageHeader
        title="Create Customer Order"
        subtitle="Place a wholesale order on behalf of a registered customer"
        showBack
        backHref={ROUTES.ORDERS.ROOT}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <CustomerSelector
            selectedUserId={selectedUserId}
            selectedAddressId={selectedAddressId}
            onSelectCustomer={handleSelectCustomer}
            onSelectAddress={setSelectedAddressId}
          />

          <ProductSelector
            selectedItems={selectedItems}
            onAddItem={handleAddItem}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
        </div>

        <div className="lg:col-span-1">
          <OrderSummaryCard
            selectedItems={selectedItems}
            notes={notes}
            onNotesChange={setNotes}
            onSubmitOrder={() => setShowConfirmModal(true)}
            isValid={isFormValid}
            isSubmitting={createOrderMutation.isPending}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmOrder}
        title="Submit Wholesale Order"
        description="Are you sure you want to create and submit this wholesale order? It will be processed immediately and notifications will be sent to the customer."
        confirmText="Confirm Order"
        isLoading={createOrderMutation.isPending}
      />
    </div>
  );
}
