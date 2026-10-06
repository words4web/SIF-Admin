"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddressPayload } from "@/types/address.types";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddressPayload) => void;
  defaultValues?: Partial<AddressPayload>;
  isLoading?: boolean;
  title?: string;
}

export function AddressModal({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
  isLoading,
  title = "Add Address",
}: AddressModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressPayload>({ defaultValues });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    reset(defaultValues ?? {});
  }, [defaultValues, reset]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
  const labelClass = "block text-xs font-semibold text-muted-foreground mb-1";
  const errorClass = "mt-1 text-xs text-destructive";

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto w-full max-w-lg h-fit rounded-2xl border border-border bg-card p-6 shadow-xl backdrop:bg-black/60 backdrop:backdrop-blur-sm text-card-foreground focus:outline-none">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-serif text-xl font-bold tracking-tight">
            {title}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg text-muted-foreground"
            onClick={onClose}
            aria-label="Close">
            <X className="size-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input
                {...register("fullName", { required: "Full name is required" })}
                className={inputClass}
                placeholder="John Smith"
              />
              {errors.fullName && (
                <p className={errorClass}>{errors.fullName.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Phone *</label>
              <input
                {...register("phone", {
                  required: "Phone is required",
                  pattern: {
                    value: /^(\+39|0039)?\s?([03]\d{7,10})$/,
                    message:
                      "Invalid Italian phone number format (e.g. +393890220807 or 0372432787)",
                  },
                })}
                className={inputClass}
                placeholder="+39 389 0220807"
              />
              {errors.phone && (
                <p className={errorClass}>{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className={labelClass}>Street Address *</label>
            <input
              {...register("streetAddress", {
                required: "Street address is required",
              })}
              className={inputClass}
              placeholder="123 High Street"
            />
            {errors.streetAddress && (
              <p className={errorClass}>{errors.streetAddress.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Building / Apartment</label>
            <input
              {...register("building")}
              className={inputClass}
              placeholder="Flat 4B (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>City *</label>
              <input
                {...register("city", { required: "City is required" })}
                className={inputClass}
                placeholder="London"
              />
              {errors.city && (
                <p className={errorClass}>{errors.city.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Postal Code *</label>
              <input
                {...register("postalCode", {
                  required: "Postal code is required",
                })}
                className={inputClass}
                placeholder="SW1A 1AA"
              />
              {errors.postalCode && (
                <p className={errorClass}>{errors.postalCode.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving…" : "Save Address"}
            </Button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
