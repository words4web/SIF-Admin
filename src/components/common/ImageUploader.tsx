"use client";

import { useCallback } from "react";
import { Plus, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ImageUploaderProps } from "@/types/upload.types";
import { filterValidImageFiles } from "@/utils/fileValidation";

export function ImageUploader({
  value = [],
  onChange,
  maxFiles = 3,
  maxSizeMB = 3,
  error,
  disabled = false,
}: ImageUploaderProps) {
  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      if (disabled) return;

      const validFiles = filterValidImageFiles(newFiles, maxSizeMB);
      if (validFiles?.length === 0) return;

      if (value?.length + validFiles?.length > maxFiles) {
        toast.error(`You can only upload a maximum of ${maxFiles} images.`);
        const allowedCount = maxFiles - value?.length;
        if (allowedCount <= 0) return;
        const sliced = validFiles?.slice(0, allowedCount);
        onChange?.([...value, ...sliced]);
        return;
      }

      onChange?.([...value, ...validFiles]);
    },
    [disabled, value, maxFiles, maxSizeMB, onChange],
  );

  const handleRemove = (indexToRemove: number) => {
    if (disabled) return;
    const updated = value?.filter((_, idx) => idx !== indexToRemove);
    onChange?.(updated);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        {value?.map((item, index) => {
          const isFile = item instanceof File;
          const previewUrl = isFile
            ? URL.createObjectURL(item)
            : (item as string);

          return (
            <div
              key={index}
              className="group relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-border/80 bg-muted/20 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={`Product Image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <div className="absolute top-1.5 left-1.5 z-10 pointer-events-none">
                {isFile ? (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-500/90 text-white backdrop-blur-xs shadow-xs">
                    New
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-600/90 text-white backdrop-blur-xs shadow-xs">
                    <CheckCircle2 className="w-2 h-2" /> Saved
                  </span>
                )}
              </div>

              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-1.5 right-1.5 z-10 p-1 rounded-full bg-black/60 text-white hover:bg-destructive hover:text-white transition-colors duration-150 shadow-xs cursor-pointer"
                  title="Remove image">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        {value?.length < maxFiles && (
          <div
            className={cn(
              "relative flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 border-2 border-dashed border-primary/30 rounded-2xl transition-all duration-200 cursor-pointer bg-primary/5 hover:bg-primary/10 hover:border-primary shrink-0 group overflow-hidden",
              disabled && "opacity-50 cursor-not-allowed pointer-events-none",
              error && "border-destructive/80 bg-destructive/5",
            )}>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/jpg"
              disabled={disabled}
              className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer disabled:cursor-not-allowed"
              onChange={(e) => {
                if (e.target.files) {
                  handleFiles(e.target.files);
                  e.target.value = "";
                }
              }}
            />

            <div className="flex flex-col items-center justify-center pointer-events-none z-10">
              <div className="p-1.5 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-200">
                <Plus className="w-4 h-4" />
              </div>

              <span className="text-[11px] font-semibold text-primary mt-1">
                Add Image
              </span>
              <span className="text-[9px] text-muted-foreground">
                ({value?.length}/{maxFiles})
              </span>
            </div>
          </div>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground">
        JPEG, PNG, WebP up to {maxSizeMB}MB each (max {maxFiles} images)
      </p>

      {error && (
        <p className="text-xs font-medium text-destructive mt-0.5">{error}</p>
      )}
    </div>
  );
}
