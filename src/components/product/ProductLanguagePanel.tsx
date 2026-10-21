"use client";

import { Input } from "@/components/common/Input";
import { Textarea } from "@/components/common/Textarea";
import { ProductLanguagePanelProps } from "@/types/product/product.types";

export function ProductLanguagePanel({
  lang,
  flag,
  title,
  subtitle,
  nameLabel,
  namePlaceholder,
  nameRequiredMsg,
  descriptionLabel,
  descriptionPlaceholder,
  descriptionValue,
  register,
  errors,
  disabled,
  onNameChange,
}: ProductLanguagePanelProps) {
  const registeredName = register(`name.${lang}`, {
    required: nameRequiredMsg,
    onChange: (e) => {
      onNameChange?.(e.target.value);
    },
  });

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
          disabled={disabled}
          error={errors.name?.[lang]?.message}
          {...registeredName}
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor={`description-${lang}`}
              className="text-sm font-bold text-foreground">
              {descriptionLabel}
            </label>
            <span className="text-xs text-muted-foreground font-mono">
              {descriptionValue.length}/3000
            </span>
          </div>
          <Textarea
            id={`description-${lang}`}
            rows={5}
            placeholder={descriptionPlaceholder}
            className="text-base p-4"
            disabled={disabled}
            error={errors.description?.[lang]?.message}
            {...register(`description.${lang}`, {
              maxLength: {
                value: 3000,
                message: "Description cannot exceed 3000 characters",
              },
            })}
          />
        </div>
      </div>
    </div>
  );
}
