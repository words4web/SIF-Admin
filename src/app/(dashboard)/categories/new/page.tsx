"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateCategory } from "@/services/category/category.hook";
import { CategoryForm } from "@/components/category/CategoryForm";
import { CategoryFormValues } from "@/types/category/category.types";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";
import { uploadService } from "@/services/upload/upload.service";

export default function NewCategoryPage() {
  const router = useRouter();
  const { mutate: createCategory, isPending } = useCreateCategory();
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (values: CategoryFormValues) => {
    try {
      setIsUploading(true);
      let finalImageUrl: string | null = null;

      if (values.image && values.image.length > 0) {
        const uploadedUrls = await uploadService.processFormImages(
          values.image,
          "categories",
        );
        finalImageUrl = uploadedUrls[0] || null;
      }

      createCategory(
        {
          name: values.name,
          slug: values.slug,
          image: finalImageUrl,
          tagline: values.tagline?.trim() || null,
          description: values.description?.trim() || null,
          isActive: values.isActive,
        },
        {
          onSuccess: () => router.push(ROUTES.CATEGORIES.ROOT),
          onError: () => setIsUploading(false),
        },
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload category image");
      setIsUploading(false);
    }
  };

  const isBusy = isPending || isUploading;

  return (
    <>
      <PageHeader
        title="New Category"
        subtitle="Create a new product category"
        backHref={ROUTES.CATEGORIES.ROOT}
      />
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-6xl">
          <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 lg:p-12 shadow-md">
            <CategoryForm
              onSubmit={handleSubmit}
              isLoading={isBusy}
              submitLabel="Create Category"
            />
          </div>
        </div>
      </div>
    </>
  );
}
