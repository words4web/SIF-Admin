"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useCategoryDetail,
  useUpdateCategory,
} from "@/services/category/category.hook";
import { CategoryForm } from "@/components/category/CategoryForm";
import { CategoryFormValues } from "@/types/category/category.types";
import { QueryBoundary } from "@/components/common/QueryBoundary";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";
import { uploadService } from "@/services/upload/upload.service";

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, isError, error, refetch } = useCategoryDetail(id);
  const { mutate: updateCategory, isPending } = useUpdateCategory();
  const [isUploading, setIsUploading] = useState(false);

  const category = data?.data;

  const handleSubmit = async (values: CategoryFormValues) => {
    try {
      setIsUploading(true);
      let finalImageUrl: string | null = null;

      if (values?.image && values?.image?.length > 0) {
        const uploadedUrls = await uploadService.processFormImages(
          values.image,
          "categories",
        );
        finalImageUrl = uploadedUrls[0] || null;
      }

      updateCategory(
        {
          id,
          payload: {
            name: values.name,
            slug: values.slug,
            image: finalImageUrl,
            tagline: values.tagline?.trim() || null,
            description: values.description?.trim() || null,
            isActive: values.isActive,
          },
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
    <QueryBoundary
      isLoading={isLoading}
      isError={isError}
      error={error}
      refetch={refetch}
      hasData={!!category}
      notFoundMessage="Category not found.">
      <PageHeader
        title="Edit Category"
        subtitle={category?.name}
        backHref={ROUTES.CATEGORIES.DETAIL(id)}
      />
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-6xl">
          <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 lg:p-12 shadow-md">
            <CategoryForm
              defaultValues={{
                name: category?.name,
                slug: category?.slug,
                image: category?.image ? [category.image] : [],
                tagline: category?.tagline || "",
                description: category?.description || "",
                isActive: category?.isActive,
              }}
              onSubmit={handleSubmit}
              isLoading={isBusy}
              submitLabel="Save Changes"
            />
          </div>
        </div>
      </div>
    </QueryBoundary>
  );
}
