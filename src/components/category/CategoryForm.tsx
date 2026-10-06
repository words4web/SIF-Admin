"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Image as ImageIcon, Globe } from "lucide-react";
import { Input } from "@/components/common/Input";
import { Textarea } from "@/components/common/Textarea";
import { Loader } from "@/components/common/Loader";
import { ImageUploader } from "@/components/common/ImageUploader";
import { FormSection } from "@/components/common/FormSection";
import { CheckboxCard } from "@/components/common/CheckboxCard";
import {
  CategoryFormValues,
  CategoryFormProps,
} from "@/types/category/category.types";
import { toSlug } from "@/lib/utils";

export function CategoryForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = "Save Category",
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    defaultValues: {
      name: "",
      slug: "",
      image: [],
      tagline: "",
      description: "",
      isActive: true,
      ...defaultValues,
    },
  });

  const nameValue = watch("name");
  const taglineValue = watch("tagline") || "";
  const descriptionValue = watch("description") || "";
  const isEditing = !!defaultValues?.slug;

  useEffect(() => {
    if (!isEditing) {
      setValue("slug", toSlug(nameValue || ""), { shouldValidate: false });
    }
  }, [nameValue, isEditing, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <div className="lg:col-span-5 space-y-8">
          <FormSection
            title="Visual Identity"
            description="Hero cover image for catalogue">
            <div className="rounded-2xl border border-border/80 bg-muted/20 p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <ImageIcon className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    Cover Banner
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    JPEG, PNG, WebP up to 3MB
                  </p>
                </div>
              </div>

              <div className="pt-1">
                <Controller
                  name="image"
                  control={control}
                  rules={{
                    validate: (val) => {
                      if (val && val.length > 1) {
                        return "Maximum 1 image allowed for category";
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <ImageUploader
                      value={field.value || []}
                      onChange={field.onChange}
                      maxFiles={1}
                      disabled={isLoading}
                      error={errors.image?.message}
                    />
                  )}
                />
              </div>
            </div>
          </FormSection>

          <FormSection
            title="Visibility"
            description="Toggle customer catalogue availability">
            <CheckboxCard
              id="isActive"
              label="Active & Visible in Catalogue"
              containerClassName="p-5"
              disabled={isLoading}
              {...register("isActive")}
            />
          </FormSection>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <FormSection
            title="Category Details"
            description="Name, URL slug, and brand storytelling">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  id="name"
                  label="Category Name *"
                  placeholder="e.g. Flours & Atta"
                  className="h-13 text-base px-4"
                  disabled={isLoading}
                  error={errors.name?.message}
                  {...register("name", {
                    required: "Category name is required",
                  })}
                />

                <div className="space-y-1.5">
                  <Input
                    id="slug"
                    label="Slug *"
                    placeholder="e.g. flours-atta"
                    className="h-13 text-sm px-4 font-mono bg-muted/30"
                    disabled={isLoading}
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
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Globe className="size-3" /> Auto-generated slug
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="tagline"
                    className="text-sm font-bold text-foreground">
                    Tagline / Short Hook
                  </label>
                  <span className="text-xs text-muted-foreground font-mono">
                    {taglineValue.length}/150
                  </span>
                </div>
                <Input
                  id="tagline"
                  placeholder="e.g. Stone-ground, pure & wholesome flours for everyday perfection"
                  className="h-13 text-base px-4"
                  disabled={isLoading}
                  error={errors.tagline?.message}
                  {...register("tagline", {
                    maxLength: {
                      value: 150,
                      message: "Tagline cannot exceed 150 characters",
                    },
                  })}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="description"
                    className="text-sm font-bold text-foreground">
                    Description & Story
                  </label>
                  <span className="text-xs text-muted-foreground font-mono">
                    {descriptionValue.length}/1000
                  </span>
                </div>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Enter a rich description, sourcing origins, or customer-facing story..."
                  className="text-base p-4"
                  disabled={isLoading}
                  error={errors.description?.message}
                  {...register("description", {
                    maxLength: {
                      value: 1000,
                      message: "Description cannot exceed 1000 characters",
                    },
                  })}
                />
              </div>
            </div>
          </FormSection>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-base font-extrabold hover:bg-primary/90 transition-all duration-200 disabled:opacity-60 flex items-center justify-center cursor-pointer shadow-lg shadow-primary/20 hover:shadow-xl active:scale-[0.99]">
              {isLoading ? (
                <Loader
                  size="sm"
                  text="Saving category..."
                  className="animate-pulse"
                />
              ) : (
                submitLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default CategoryForm;
