"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IShippingConfig } from "@/types/config/config.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/common/Input";
import { Truck, Save } from "lucide-react";
import { useUpdateAdminConfigMutation } from "@/services/config/config.hook";

export function ShippingConfigSection({
  initialConfig,
}: {
  initialConfig?: IShippingConfig;
}) {
  const updateMutation = useUpdateAdminConfigMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IShippingConfig>({
    defaultValues: {
      weightThresholdKg: initialConfig?.weightThresholdKg ?? 3.5,
      chargePerWeightThreshold: initialConfig?.chargePerWeightThreshold ?? 5,
      freeShippingWeightThresholdKg:
        initialConfig?.freeShippingWeightThresholdKg ?? 50,
    },
  });

  useEffect(() => {
    if (initialConfig) {
      reset({
        weightThresholdKg: initialConfig?.weightThresholdKg ?? 3.5,
        chargePerWeightThreshold: initialConfig?.chargePerWeightThreshold ?? 5,
        freeShippingWeightThresholdKg:
          initialConfig?.freeShippingWeightThresholdKg ?? 50,
      });
    }
  }, [initialConfig, reset]);

  const onSubmit = (data: IShippingConfig) => {
    updateMutation.mutate({
      shipping: {
        weightThresholdKg: Number(data?.weightThresholdKg),
        chargePerWeightThreshold: Number(data?.chargePerWeightThreshold),
        freeShippingWeightThresholdKg: Number(
          data?.freeShippingWeightThresholdKg,
        ),
      },
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              Dynamic Shipping Configuration
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Set weight-based shipping rates and free delivery weight
              thresholds.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Input
            id="weightThreshold"
            label="Weight Tier Step (kg) *"
            type="number"
            step="0.1"
            min="0.1"
            className="rounded-xl font-medium"
            error={errors.weightThresholdKg?.message}
            {...register("weightThresholdKg", {
              required: "Weight tier step is required",
              min: { value: 0.1, message: "Must be greater than 0" },
              valueAsNumber: true,
            })}
          />

          <Input
            id="costPerStep"
            label="Charge Per Tier (€) *"
            type="number"
            step="0.5"
            min="0"
            className="rounded-xl font-medium"
            error={errors.chargePerWeightThreshold?.message}
            {...register("chargePerWeightThreshold", {
              required: "Charge per tier is required",
              min: { value: 0, message: "Cannot be negative" },
              valueAsNumber: true,
            })}
          />

          <Input
            id="freeWeightThreshold"
            label="Free Shipping Weight (kg) *"
            type="number"
            step="0.5"
            min="0"
            className="rounded-xl font-medium"
            error={errors.freeShippingWeightThresholdKg?.message}
            {...register("freeShippingWeightThresholdKg", {
              required: "Free shipping weight threshold is required",
              min: { value: 0, message: "Cannot be negative" },
              valueAsNumber: true,
            })}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="rounded-xl font-semibold gap-2 min-w-[140px]">
            <Save className="h-4 w-4" />{" "}
            {updateMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
