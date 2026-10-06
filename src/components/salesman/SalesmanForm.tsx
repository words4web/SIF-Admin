"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/common/Input";
import { FormSection } from "@/components/common/FormSection";
import { SalesmanPermissionSelector } from "./SalesmanPermissionSelector";
import { SalesmanPermission } from "@/types/salesman.types";
import {
  SalesmanFormProps,
  SalesmanFormValues,
} from "@/types/salesmanForm.types";

export function SalesmanForm({
  mode,
  defaultValues,
  onSubmit,
  onDirtyChange,
  disabled = false,
}: SalesmanFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<SalesmanFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      permissions: [],
      ...defaultValues,
    },
  });

  const selectedPermissions = watch("permissions") || [];

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const togglePermission = (perm: SalesmanPermission) => {
    if (disabled) return;
    const current = selectedPermissions;
    const updated = current?.includes(perm)
      ? current?.filter((p) => p !== perm)
      : [...current, perm];

    setValue("permissions", updated, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <form
      id="salesman-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
        <FormSection
          title="Account Details"
          description="Basic profile and credentials for the salesman">
          <div className="space-y-4">
            <Input
              id="salesman-fullname"
              label="Full Name"
              placeholder="e.g. John Smith"
              disabled={disabled}
              error={errors.fullName?.message}
              {...register("fullName", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Full name must be at least 2 characters",
                },
              })}
            />

            {mode === "create" && (
              <>
                <Input
                  id="salesman-email"
                  label="Email Address"
                  type="email"
                  placeholder="e.g. john@example.com"
                  disabled={disabled}
                  error={errors.email?.message}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                />

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="salesman-password"
                    className="text-sm font-bold text-foreground">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="salesman-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 8 characters"
                      disabled={disabled}
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 pr-10 text-sm font-normal outline-none transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                      })}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p
                      className="text-xs font-semibold text-destructive mt-0.5"
                      role="alert">
                      {errors?.password?.message}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </FormSection>
      </div>

      <input
        type="hidden"
        {...register("permissions", {
          validate: (v) =>
            (v && v.length > 0) || "At least one permission must be selected",
        })}
      />

      <SalesmanPermissionSelector
        selectedPermissions={selectedPermissions}
        onToggle={togglePermission}
        error={errors.permissions?.message}
        disabled={disabled}
      />
    </form>
  );
}
