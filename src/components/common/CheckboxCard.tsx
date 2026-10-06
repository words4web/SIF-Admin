import React, { forwardRef } from "react";

export interface CheckboxCardProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  containerClassName?: string;
}

export const CheckboxCard = forwardRef<HTMLInputElement, CheckboxCardProps>(
  ({ label, className = "", containerClassName = "", id, ...props }, ref) => {
    return (
      <label
        htmlFor={id}
        className={`flex items-center justify-between p-4 rounded-xl border border-border/80 bg-card hover:bg-accent/40 transition-colors cursor-pointer select-none ${containerClassName}`}>
        <span className="text-sm font-bold text-foreground">{label}</span>
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className={`size-5 rounded border-input accent-primary cursor-pointer shrink-0 ${className}`}
          {...props}
        />
      </label>
    );
  },
);

CheckboxCard.displayName = "CheckboxCard";
export default CheckboxCard;
