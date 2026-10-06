"use client";

import {
  ALL_PERMISSIONS,
  SALESMAN_PERMISSION_LABELS,
} from "@/types/salesman.types";
import { SalesmanPermissionSelectorProps } from "@/types/salesmanForm.types";
import { FormSection } from "@/components/common/FormSection";

export function SalesmanPermissionSelector({
  selectedPermissions,
  onToggle,
  error,
  disabled = false,
}: SalesmanPermissionSelectorProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
      <FormSection
        title="Permissions & Access"
        description="Select the operational modules this salesman can access">
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ALL_PERMISSIONS.map((perm) => {
              const { label, description } = SALESMAN_PERMISSION_LABELS[perm];
              const isChecked = selectedPermissions?.includes(perm);

              return (
                <div
                  key={perm}
                  onClick={() => onToggle(perm)}
                  className={`flex items-start justify-between gap-4 p-4 rounded-xl border transition-all cursor-pointer select-none ${
                    isChecked
                      ? "border-primary/40 bg-primary/5"
                      : "border-border/80 bg-card hover:bg-accent/40"
                  } ${disabled ? "opacity-60 pointer-events-none" : ""}`}>
                  <div>
                    <p className="text-sm font-bold text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {description}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    id={`perm-${perm}`}
                    checked={isChecked}
                    onChange={() => {}}
                    disabled={disabled}
                    className="size-5 rounded border-input accent-primary cursor-pointer shrink-0 mt-0.5 pointer-events-none"
                  />
                </div>
              );
            })}
          </div>

          {error && (
            <p
              className="text-xs font-semibold text-destructive mt-1"
              role="alert">
              {error}
            </p>
          )}
        </div>
      </FormSection>
    </div>
  );
}
