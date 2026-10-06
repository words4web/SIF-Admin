import React, { forwardRef } from "react";

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "prefix"
> {
  label?: string;
  error?: string;
  containerClassName?: string;
  prefix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      className = "",
      containerClassName = "",
      id,
      prefix,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label htmlFor={id} className="text-sm font-bold text-foreground">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-4 text-base font-semibold text-muted-foreground select-none pointer-events-none">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={`h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal outline-none transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 ${
              prefix ? "pl-8" : ""
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p
            className="text-xs font-semibold text-destructive mt-0.5"
            role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
