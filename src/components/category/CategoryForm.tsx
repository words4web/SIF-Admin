"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Image as ImageIcon,
  Globe,
  Languages,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/common/Input";
import { Loader } from "@/components/common/Loader";
import { ImageUploader } from "@/components/common/ImageUploader";
import { FormSection } from "@/components/common/FormSection";
import { CheckboxCard } from "@/components/common/CheckboxCard";
import {
  CategoryFormValues,
  CategoryFormProps,
} from "@/types/category/category.types";
import { toSlug } from "@/lib/utils";

import { CategoryLanguagePanel } from "./CategoryLanguagePanel";

type SupportedLang = "en" | "it";

export function CategoryForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = "Save Category",
}: CategoryFormProps) {
  const [activeLang, setActiveLang] = useState<SupportedLang>("en");

  const initialName =
    typeof defaultValues?.name === "object"
      ? defaultValues.name
      : {
          en: (defaultValues?.name as any) || "",
          it: (defaultValues?.name as any) || "",
        };

  const initialTagline =
    typeof defaultValues?.tagline === "object"
      ? defaultValues.tagline
      : {
          en: (defaultValues?.tagline as any) || "",
          it: (defaultValues?.tagline as any) || "",
        };

  const initialDescription =
    typeof defaultValues?.description === "object"
      ? defaultValues.description
      : {
          en: (defaultValues?.description as any) || "",
          it: (defaultValues?.description as any) || "",
        };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    defaultValues: {
      name: initialName,
      slug: defaultValues?.slug || "",
      image: defaultValues?.image || [],
      tagline: initialTagline,
      description: initialDescription,
      isActive: defaultValues?.isActive ?? true,
    },
  });

  const nameEnValue = watch("name.en") || "";
  const nameItValue = watch("name.it") || "";
  const taglineEnValue = watch("tagline.en") || "";
  const taglineItValue = watch("tagline.it") || "";
  const descriptionEnValue = watch("description.en") || "";
  const descriptionItValue = watch("description.it") || "";
  const isEditing = !!defaultValues?.slug;

  const isEnComplete = Boolean(nameEnValue.trim());
  const isItComplete = Boolean(nameItValue.trim());

  useEffect(() => {
    if (!isEditing && nameEnValue) {
      setValue("slug", toSlug(nameEnValue), { shouldValidate: false });
    }
  }, [nameEnValue, isEditing, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Media & Visibility */}
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

          {/* URL Slug */}
          <FormSection
            title="URL Routing"
            description="Permanent web URL slug for this category">
            <div className="space-y-2">
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
                <Globe className="size-3" /> Auto-generated from English name
              </span>
            </div>
          </FormSection>
        </div>

        {/* Right Column: Tabbed Language Switcher Details */}
        <div className="lg:col-span-7 space-y-8">
          <FormSection
            title="Localized Content"
            description="Manage category content across English and Italian markets">
            <div className="space-y-6">
              {/* Language Navigation Tabs */}
              <div className="flex items-center justify-between p-1.5 rounded-2xl bg-muted/50 border border-border/80">
                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveLang("en")}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                      activeLang === "en"
                        ? "bg-card text-foreground shadow-sm border border-border"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}>
                    <span className="text-base">🇬🇧</span>
                    <span>English</span>
                    {isEnComplete ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-600">
                        <CheckCircle2 className="size-3" /> Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/10 text-amber-600">
                        <AlertCircle className="size-3" /> Required
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveLang("it")}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                      activeLang === "it"
                        ? "bg-card text-foreground shadow-sm border border-border"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}>
                    <span className="text-base">🇮🇹</span>
                    <span>Italian</span>
                    {isItComplete ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-600">
                        <CheckCircle2 className="size-3" /> Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/10 text-amber-600">
                        <AlertCircle className="size-3" /> Required
                      </span>
                    )}
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground pr-2 font-medium">
                  <Languages className="size-3.5 text-primary" />
                  <span>Dual Locale</span>
                </div>
              </div>

              {/* Tab 1: English Panel */}
              <div
                className={`space-y-6 animate-fade-in ${activeLang === "en" ? "block" : "hidden"}`}>
                <CategoryLanguagePanel
                  lang="en"
                  flag="🇬🇧"
                  title="English Content"
                  subtitle="Primary catalogue presentation & default fallback"
                  nameLabel="Category Name (English) *"
                  namePlaceholder="e.g. Spices & Seasonings"
                  nameRequiredMsg="English category name is required"
                  taglineLabel="Tagline / Short Hook (English)"
                  taglinePlaceholder="e.g. Asia's finest spices, whole seeds & pure blends"
                  taglineMaxMsg="Tagline cannot exceed 150 characters"
                  descriptionLabel="Description (English)"
                  descriptionPlaceholder="Detailed English description for the catalogue banner and storytelling..."
                  descriptionMaxMsg="Description cannot exceed 1000 characters"
                  taglineValue={taglineEnValue}
                  descriptionValue={descriptionEnValue}
                  register={register}
                  errors={errors}
                  isLoading={isLoading}
                />
              </div>

              {/* Tab 2: Italian Panel */}
              <div
                className={`space-y-6 animate-fade-in ${activeLang === "it" ? "block" : "hidden"}`}>
                <CategoryLanguagePanel
                  lang="it"
                  flag="🇮🇹"
                  title="Contenuto in Italiano"
                  subtitle="Visualizzato ai clienti durante la navigazione in lingua italiana"
                  nameLabel="Nome Categoria (Italiano) *"
                  namePlaceholder="es. Spezie e Condimenti"
                  nameRequiredMsg="Il nome della categoria in italiano è obbligatorio"
                  taglineLabel="Slogan / Tagline (Italiano)"
                  taglinePlaceholder="es. Le migliori spezie dell'Asia, semi interi e miscele pure"
                  taglineMaxMsg="Lo slogan non può superare i 150 caratteri"
                  descriptionLabel="Descrizione (Italiano)"
                  descriptionPlaceholder="Descrizione dettagliata in italiano per il catalogo online..."
                  descriptionMaxMsg="La descrizione non può superare i 1000 caratteri"
                  taglineValue={taglineItValue}
                  descriptionValue={descriptionItValue}
                  register={register}
                  errors={errors}
                  isLoading={isLoading}
                />
              </div>

              {(errors.name?.en || errors.name?.it) && (
                <div className="p-3.5 rounded-xl bg-white border border-rose-300 dark:border-rose-900/50 shadow-sm flex items-center gap-2.5 text-sm font-semibold text-rose-600">
                  <AlertCircle className="size-4.5 shrink-0 text-rose-500" />
                  <span>
                    Please ensure required names are filled for both languages.
                  </span>
                </div>
              )}
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
