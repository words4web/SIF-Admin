"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useProductDetail,
  useUpdateProduct,
} from "@/services/product/product.hook";
import { ProductForm } from "@/components/product/ProductForm";
import { ProductFormValues } from "@/types/product/product.types";
import { QueryBoundary } from "@/components/common/QueryBoundary";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { uploadService } from "@/services/upload/upload.service";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, isError, error, refetch } = useProductDetail(id);
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [pendingValues, setPendingValues] = useState<ProductFormValues | null>(
    null,
  );
  const [isUploading, setIsUploading] = useState(false);

  const product = data?.data;

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isFormDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isFormDirty]);

  const handleBackClick = useCallback(() => {
    if (isFormDirty) {
      setShowDiscardModal(true);
    } else {
      router.back();
    }
  }, [isFormDirty, router]);

  const handleConfirmDiscard = () => {
    router.back();
  };

  const handleSubmitForm = (values: ProductFormValues) => {
    setPendingValues(values);
    setShowSaveModal(true);
  };

  const handleConfirmSave = async () => {
    if (!pendingValues || !id) return;
    try {
      setIsUploading(true);
      const finalImages = await uploadService.processFormImages(
        pendingValues?.images,
      );
      updateProduct(
        { id, payload: { ...pendingValues, images: finalImages } },
        {
          onSuccess: () => {
            setShowSaveModal(false);
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

  const formattedDefaultValues: Partial<ProductFormValues> = {
    name: product?.name,
    slug: product?.slug,
    description: product?.description || "",
    pack: product?.pack,
    price: product?.price,
    unit: product?.unit,
    categoryId:
      typeof product?.categoryId === "object"
        ? product?.categoryId?._id
        : product?.categoryId,
    keywords: Array.isArray(product?.keywords) ? product?.keywords : [],
    images: Array.isArray(product?.images) ? product?.images : [],
    relatedProducts: Array.isArray(product?.relatedProducts)
      ? product?.relatedProducts?.map((p: any) =>
          typeof p === "object" ? p?._id : p,
        )
      : [],
    isVatApplicable: product?.isVatApplicable,
    isActive: product?.isActive,
  };

  const initialRelatedOptions = Array.isArray(product?.relatedProducts)
    ? product?.relatedProducts
        ?.filter((p: any) => typeof p === "object" && p?._id && p?.name)
        ?.map((p: any) => ({ value: p._id, label: p.name }))
    : [];

  const isBusy = isPending || isUploading;

  return (
    <QueryBoundary
      isLoading={isLoading}
      isError={isError}
      error={error}
      refetch={refetch}
      hasData={!!product}
      notFoundMessage="Product not found.">
      <PageHeader
        title="Edit Product"
        subtitle={product?.name}
        onBackClick={handleBackClick}
        action={{
          label: "Save Changes",
          type: "submit",
          form: "product-form",
          variant: "default",
          isLoading: isBusy,
        }}
      />
      <div className="flex flex-col items-center justify-center min-h-[55vh]">
        <div className="w-full max-w-4xl">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <ProductForm
              defaultValues={formattedDefaultValues}
              initialRelatedOptions={initialRelatedOptions}
              currentProductId={id || product?._id}
              onSubmit={handleSubmitForm}
              onDirtyChange={setIsFormDirty}
              disabled={isBusy}
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={handleConfirmDiscard}
        title="Discard Unsaved Changes?"
        description="You have unsaved changes in this product form. Are you sure you want to leave without saving?"
        confirmText="Discard Changes"
        cancelText="Keep Editing"
        variant="destructive"
      />

      <ConfirmModal
        isOpen={showSaveModal}
        onClose={() => !isBusy && setShowSaveModal(false)}
        onConfirm={handleConfirmSave}
        isLoading={isBusy}
        title="Save Changes?"
        description="Are you sure you want to update this product's information?"
        confirmText="Save Product"
        cancelText="Cancel"
        variant="default"
      />
    </QueryBoundary>
  );
}
