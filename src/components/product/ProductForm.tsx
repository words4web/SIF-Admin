import { useCallback, useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
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
import {
  PaginatedDropdown,
  DropdownOption,
} from "@/components/common/PaginatedDropdown";
import {
  ProductFormProps,
  ProductFormValues,
} from "@/types/product/product.types";
import {
  EStockStatus,
  STOCK_STATUS_OPTIONS,
} from "@/constants/product.constants";
import { toSlug } from "@/lib/utils";

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
    watch,
    trigger,
    clearErrors,
    getValues,
    formState: { errors, isDirty },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      slug: "",
      sku: "",
      description: "",
      variants: [{ weight: 0, price: 0 }],
      stock: 1,
      stockStatus: EStockStatus.IN_STOCK,
      categoryId: "",
      keywords: [],
      images: [],
      relatedProducts: [],
      isActive: true,
      ...defaultValues,
    },
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const currentStockStatus = watch("stockStatus");
  const isOutOfStock = currentStockStatus === EStockStatus.OUT_OF_STOCK;

  const handleStockStatusChange = async (newStatus: EStockStatus) => {
    setValue("stockStatus", newStatus, { shouldDirty: true });
    if (newStatus === EStockStatus.OUT_OF_STOCK) {
      setValue("stock", 0, { shouldDirty: true });
    } else if (newStatus === EStockStatus.IN_STOCK) {
      const currentStock = getValues("stock");
      if (typeof currentStock !== "number" || currentStock < 1) {
        setValue("stock", 1, { shouldDirty: true });
      }
    }
    clearErrors("stock");
    await trigger(["stockStatus", "stock"]);
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="sku"
            label="SKU Code *"
            placeholder="e.g. SF-TEA-001"
            className="h-12 text-sm px-4 uppercase font-mono"
            disabled={disabled}
            error={errors.sku?.message}
            {...register("sku", {
              required: "SKU is required",
              setValueAs: (v) => (v ? v.trim().toUpperCase() : ""),
            })}
          />

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
                message:
                  "Slug must be lowercase alphanumeric with hyphens only",
              },
            })}
          />
        </div>
      </FormSection>

      <FormSection title="Product Media">
        <Controller
          name="images"
          control={control}
          rules={{
            required: "At least 1 product image is required",
            validate: (val) => {
              if (!val || val.length === 0) {
                return "At least 1 product image is required";
              }
              if (val.length > 3) {
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

      <FormSection title="Weight & Price Variants">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Add all available weights in grams (g) and their respective
              wholesale prices (at least 1 required).
            </p>
            <button
              type="button"
              onClick={() => appendVariant({ weight: 0, price: 0 })}
              disabled={disabled}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50 cursor-pointer">
              <Plus className="size-3.5" /> Add Weight
            </button>
          </div>

          <div className="space-y-3">
            {variantFields?.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3.5 rounded-2xl border border-border/80 bg-muted/20">
                <div className="flex-1 w-full sm:w-auto">
                  <Input
                    id={`variants.${index}.weight`}
                    type="number"
                    step="1"
                    min={1}
                    label={index === 0 ? "Weight (Grams / g) *" : undefined}
                    placeholder="e.g. 500, 1000"
                    suffix="g"
                    className="h-11 text-sm pr-7"
                    disabled={disabled}
                    error={errors.variants?.[index]?.weight?.message}
                    {...register(`variants.${index}.weight` as const, {
                      required: "Weight is required",
                      valueAsNumber: true,
                      min: {
                        value: 1,
                        message: "Weight must be at least 1 gram",
                      },
                    })}
                  />
                </div>

                <div className="flex-1 w-full sm:w-auto">
                  <Input
                    id={`variants.${index}.price`}
                    type="number"
                    step="0.01"
                    min={0.01}
                    label={index === 0 ? "Price (£) *" : undefined}
                    placeholder="0.00"
                    prefix="£"
                    className="h-11 text-sm pr-4"
                    disabled={disabled}
                    error={errors.variants?.[index]?.price?.message}
                    {...register(`variants.${index}.price` as const, {
                      required: "Price is required",
                      valueAsNumber: true,
                      min: {
                        value: 0.01,
                        message: "Price must be greater than 0",
                      },
                    })}
                  />
                </div>

                {variantFields?.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    disabled={disabled}
                    className={`p-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-colors cursor-pointer shrink-0 ${
                      index === 0 ? "sm:mt-6" : ""
                    }`}
                    title="Remove weight variant">
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {errors.variants?.message && (
            <p className="text-xs font-semibold text-destructive">
              {errors.variants.message}
            </p>
          )}
        </div>
      </FormSection>

      <FormSection title="Inventory & Stock">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="stock"
            type="number"
            min={isOutOfStock ? 0 : 1}
            step={1}
            label={`Stock Quantity * ${isOutOfStock ? "(Disabled - Out of Stock)" : ""}`}
            placeholder={isOutOfStock ? "0" : "1"}
            className="h-12 text-base px-4 disabled:opacity-60 disabled:bg-muted/40"
            disabled={disabled || isOutOfStock}
            error={errors.stock?.message}
            {...register("stock", {
              required: "Stock quantity is required",
              valueAsNumber: true,
              validate: (val, formValues) => {
                const outOfStock =
                  formValues.stockStatus === EStockStatus.OUT_OF_STOCK;
                if (outOfStock) {
                  return val === 0 ? true : "Stock must be 0 when Out of Stock";
                }
                return typeof val === "number" && val >= 1
                  ? true
                  : "Stock must be at least 1 when In Stock";
              },
            })}
          />

          <Controller
            name="stockStatus"
            control={control}
            rules={{ required: "Stock status is required" }}
            render={({ field }) => (
              <Select
                id="stockStatus"
                label="Stock Status *"
                className="h-12 text-base px-4"
                disabled={disabled}
                error={errors.stockStatus?.message}
                value={field.value || EStockStatus.IN_STOCK}
                onChange={(e) =>
                  handleStockStatusChange(e.target.value as EStockStatus)
                }
                options={STOCK_STATUS_OPTIONS}
              />
            )}
          />
        </div>
      </FormSection>

      <FormSection title="Status">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CheckboxCard
            id="isActive"
            label="Active Status"
            disabled={disabled}
            {...register("isActive")}
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
