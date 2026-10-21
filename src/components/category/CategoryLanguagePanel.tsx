"use client";

import { Input } from "@/components/common/Input";
import { Textarea } from "@/components/common/Textarea";
import { CategoryLanguagePanelProps } from "@/types/category/category.types";

export function CategoryLanguagePanel({
  lang,
  flag,
  title,
  subtitle,
  nameLabel,
  namePlaceholder,
  nameRequiredMsg,
  taglineLabel,
  taglinePlaceholder,
  taglineMaxMsg,
  descriptionLabel,
  descriptionPlaceholder,
  descriptionMaxMsg,
  taglineValue,
  descriptionValue,
  register,
  errors,
  isLoading,
}: CategoryLanguagePanelProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="text-xl">{flag}</span>
          <div>
            <h4 className="text-sm font-bold text-foreground">{title}</h4>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <Input
          id={`name-${lang}`}
          label={nameLabel}
          placeholder={namePlaceholder}
          className="h-13 text-base px-4"
          disabled={isLoading}
          error={errors.name?.[lang]?.message}
          {...register(`name.${lang}`, {
            required: nameRequiredMsg,
          })}
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor={`tagline-${lang}`}
              className="text-sm font-bold text-foreground">
              {taglineLabel}
            </label>
            <span className="text-xs text-muted-foreground font-mono">
              {taglineValue.length}/150
            </span>
          </div>
          <Input
            id={`tagline-${lang}`}
            placeholder={taglinePlaceholder}
            className="h-13 text-base px-4"
            disabled={isLoading}
            error={errors.tagline?.[lang]?.message}
            {...register(`tagline.${lang}`, {
              maxLength: {
                value: 150,
                message: taglineMaxMsg,
              },
            })}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor={`description-${lang}`}
              className="text-sm font-bold text-foreground">
              {descriptionLabel}
            </label>
            <span className="text-xs text-muted-foreground font-mono">
              {descriptionValue.length}/1000
            </span>
          </div>
          <Textarea
            id={`description-${lang}`}
            rows={4}
            placeholder={descriptionPlaceholder}
            className="text-base p-4"
            disabled={isLoading}
            error={errors.description?.[lang]?.message}
            {...register(`description.${lang}`, {
              maxLength: {
                value: 1000,
                message: descriptionMaxMsg,
              },
            })}
          />
        </div>
      </div>
    </div>
  );
}
