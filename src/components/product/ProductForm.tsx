import { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Textarea } from "@/components/common/Textarea";
import { CheckboxCard } from "@/components/common/CheckboxCard";
import { KeywordsInput } from "@/components/common/KeywordsInput";
import { Loader } from "@/components/common/Loader";
import { FormSection } from "@/components/common/FormSection";
import { ImageUploader } from "@/components/common/ImageUploader";
import { useCategories } from "@/services/category/category.hook";
import { productService } from "@/services/product/product.service";
import { uploadService } from "@/services/upload/upload.service";
import {
  PaginatedDropdown,
  DropdownOption,
} from "@/components/common/PaginatedDropdown";
import {
  ProductFormProps,
  ProductFormValues,
} from "@/types/product/product.types";
import { toSlug } from "@/lib/utils";
import { EProductUnit } from "@/constants/product.constants";

export function ProductForm({
  defaultValues,
  initialRelatedOptions,
  currentProductId,
  onSubmit,
  onDirtyChange,
  disabled = false,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isDirty },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      pack: "",
      price: 0,
      unit: EProductUnit.CASE,
      categoryId: "",
      keywords: [],
      images: [],
      relatedProducts: [],
      isVatApplicable: false,
      isActive: true,
      ...defaultValues,
    },
  });

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories({
      limit: 100,
      isActive: true,
    });
  const categories = categoriesData?.data?.categories || [];

  const fetchProductsOptions = useCallback(
    async ({
      search,
      page,
      limit,
    }: {
      search: string;
      page: number;
      limit: number;
    }) => {
      const res = await productService.list({ search, page, limit });
      const products = res?.data?.products || [];
      const total = res?.data?.total || 0;
      const options: DropdownOption[] = products
        ?.filter((p: any) => p?._id !== currentProductId)
        ?.map((p: any) => ({
          value: p?._id,
          label: p?.name,
        }));

      return {
        options,
        hasMore: page * limit < total,
      };
    },
    [currentProductId],
  );

  const handleFormSubmit = (values: ProductFormValues) => {
    onSubmit(values);
  };

  return (
    <form
      id="product-form"
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-10">
      <FormSection title="Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="name"
            label="Product Name *"
            placeholder="e.g. Badam Milk Powder Mix"
            className="h-12 text-base px-4"
            disabled={disabled}
            error={errors.name?.message}
            {...register("name", {
              required: "Name is required",
              onChange: (e) => {
                setValue("slug", toSlug(e.target.value), {
                  shouldValidate: false,
                });
              },
            })}
          />

          {isLoadingCategories ? (
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-bold text-foreground">
                Category *
              </span>
              <div className="h-12 flex items-center px-4 border border-input bg-background rounded-xl text-sm">
                <Loader size="sm" className="mr-2" /> Loading categories...
              </div>
            </div>
          ) : (
            <Controller
              name="categoryId"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <Select
                  id="categoryId"
                  label="Category *"
                  className="h-12 text-sm px-4"
                  disabled={disabled}
                  error={errors.categoryId?.message}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  options={[
                    { value: "", label: "Select a Category" },
                    ...(categories?.map((c: any) => ({
                      value: String(c._id),
                      label: c.name,
                    })) || []),
                  ]}
                />
              )}
            />
          )}
        </div>

        <Input
          id="slug"
          label="Slug *"
          placeholder="e.g. sweets-desserts-badam-milk-powder-mix-200g"
          className="h-12 text-sm px-4 bg-muted/30 cursor-not-allowed"
          disabled
          error={errors.slug?.message}
          {...register("slug", {
            required: "Slug is required",
            pattern: {
              value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
              message: "Slug must be lowercase alphanumeric with hyphens only",
            },
          })}
        />
      </FormSection>

      <FormSection title="Product Media">
        <Controller
          name="images"
          control={control}
          rules={{
            validate: (val) => {
              if (val && val.length > 3) {
                return "Maximum 3 images allowed";
              }
              return true;
            },
          }}
          render={({ field }) => (
            <ImageUploader
              value={field.value || []}
              onChange={field.onChange}
              disabled={disabled}
              error={errors.images?.message}
            />
          )}
        />
      </FormSection>

      <FormSection title="Packaging & Pricing">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            id="pack"
            label="Pack Size / Weight *"
            placeholder="e.g. 200g, 12x400g"
            className="h-12 text-base px-4"
            disabled={disabled}
            error={errors.pack?.message}
            {...register("pack", { required: "Pack size is required" })}
          />

          <Controller
            name="unit"
            control={control}
            rules={{ required: "Unit is required" }}
            render={({ field }) => (
              <Select
                id="unit"
                label="Unit *"
                className="h-12 text-base px-4 capitalize"
                disabled={disabled}
                error={errors.unit?.message}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                options={Object.values(EProductUnit).map((u) => ({
                  value: u,
                  label: u,
                }))}
              />
            )}
          />

          <Input
            id="price"
            type="number"
            step="0.01"
            min={0}
            label="Price (£) *"
            placeholder="0.00"
            prefix="£"
            className="h-12 text-base pr-4"
            disabled={disabled}
            error={errors.price?.message}
            {...register("price", {
              required: "Price is required",
              valueAsNumber: true,
              min: { value: 0, message: "Price cannot be negative" },
            })}
          />
        </div>
      </FormSection>

      <FormSection title="Status & Tax">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CheckboxCard
            id="isActive"
            label="Active Status"
            disabled={disabled}
            {...register("isActive")}
          />
          <CheckboxCard
            id="isVatApplicable"
            label="VAT Applicable"
            disabled={disabled}
            {...register("isVatApplicable")}
          />
        </div>
      </FormSection>

      <FormSection title="Search & Discovery">
        <Controller
          name="keywords"
          control={control}
          rules={{
            validate: (val) => {
              if (!val || val.length === 0)
                return "At least 1 keyword is required";
              const lowercased = val.map((k) => k.toLowerCase().trim());
              if (new Set(lowercased).size !== lowercased.length) {
                return "Duplicate keywords are not allowed";
              }
              return true;
            },
          }}
          render={({ field }) => (
            <KeywordsInput
              value={field.value || []}
              onChange={field.onChange}
              disabled={disabled}
              error={errors.keywords?.message}
            />
          )}
        />
      </FormSection>

      <FormSection title="Related Products">
        <div className="flex flex-col gap-2">
          <Controller
            name="relatedProducts"
            control={control}
            render={({ field }) => (
              <PaginatedDropdown
                value={field.value || []}
                onChange={field.onChange}
                fetchData={fetchProductsOptions}
                initialOptions={initialRelatedOptions}
                placeholder="Search & select related products..."
              />
            )}
          />
        </div>
      </FormSection>

      <FormSection title="Description">
        <Textarea
          id="description"
          rows={5}
          placeholder="Enter a detailed product description, ingredients, or usage instructions..."
          disabled={disabled}
          {...register("description")}
        />
      </FormSection>
    </form>
  );
}

export default ProductForm;
