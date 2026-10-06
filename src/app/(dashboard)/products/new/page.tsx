"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateProduct } from "@/services/product/product.hook";
import { ProductForm } from "@/components/product/ProductForm";
import { ProductFormValues } from "@/types/product/product.types";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { uploadService } from "@/services/upload/upload.service";

export default function NewProductPage() {
  const router = useRouter();
  const { mutate: createProduct, isPending } = useCreateProduct();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pendingValues, setPendingValues] = useState<ProductFormValues | null>(
    null,
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (values: ProductFormValues) => {
    setPendingValues(values);
    setShowCreateModal(true);
  };

  const handleConfirmCreate = async () => {
    if (!pendingValues) return;
    try {
      setIsUploading(true);
      const finalImages = await uploadService.processFormImages(
        pendingValues?.images,
      );
      createProduct(
        { ...pendingValues, images: finalImages },
        {
          onSuccess: () => {
            setShowCreateModal(false);
            router.back();
          },
          onError: () => {
            setIsUploading(false);
          },
        },
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload images. Please try again.");
      setIsUploading(false);
    }
  };

  const isBusy = isPending || isUploading;

  return (
    <>
      <PageHeader
        title="New Product"
        subtitle="Create a new product listing"
        showBack={true}
        action={{
          label: "Create Product",
          type: "submit",
          form: "product-form",
          variant: "default",
          isLoading: isBusy,
        }}
      />
      <div className="flex flex-col items-center justify-center min-h-[55vh]">
        <div className="w-full max-w-4xl">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <ProductForm onSubmit={handleSubmit} disabled={isBusy} />
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showCreateModal}
        onClose={() => !isBusy && setShowCreateModal(false)}
        onConfirm={handleConfirmCreate}
        isLoading={isBusy}
        title="Create Product?"
        description="Are you sure you want to create this new product listing?"
        confirmText="Create Product"
        cancelText="Cancel"
        variant="default"
      />
    </>
  );
}
