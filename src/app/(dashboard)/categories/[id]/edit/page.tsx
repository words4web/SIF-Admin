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

import { cleanLocalizedString } from "@/utils/localization";

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
            name: {
              en: values.name?.en?.trim() || "",
              it: values.name?.it?.trim() || "",
            },
            slug: values.slug,
            image: finalImageUrl,
            tagline: cleanLocalizedString(values.tagline),
            description: cleanLocalizedString(values.description),
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

  const categoryNameDisplay =
    typeof category?.name === "object"
      ? category?.name?.en || category?.name?.it
      : category?.name;

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
        subtitle={categoryNameDisplay}
        backHref={ROUTES.CATEGORIES.DETAIL(id)}
      />
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-6xl">
          <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 lg:p-12 shadow-md">
            <CategoryForm
              defaultValues={{
                name:
                  typeof category?.name === "object"
                    ? category.name
                    : { en: category?.name || "", it: category?.name || "" },
                slug: category?.slug,
                image: category?.image ? [category.image] : [],
                tagline:
                  typeof category?.tagline === "object"
                    ? category.tagline
                    : {
                        en: category?.tagline || "",
                        it: category?.tagline || "",
                      },
                description:
                  typeof category?.description === "object"
                    ? category.description
                    : {
                        en: category?.description || "",
                        it: category?.description || "",
                      },
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
