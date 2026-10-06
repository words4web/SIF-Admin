import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  error?: string;
  value?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  options?: SelectOption[];
  children?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  name?: string;
  id?: string;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      label,
      error,
      value = "",
      onChange,
      options,
      children,
      placeholder = "Select an option",
      disabled = false,
      className = "",
      containerClassName = "",
      name,
      id,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const parsedOptions: SelectOption[] = options
      ? options
      : React.Children.toArray(children)
          .filter(React.isValidElement)
          .map((child: any) => ({
            value: String(child.props.value ?? ""),
            label: String(child.props.children ?? ""),
          }));

    const selectedOption = parsedOptions.find((opt) => opt.value === value);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (val: string) => {
      if (disabled) return;
      onChange?.({ target: { value: val, name } });
      setIsOpen(false);
    };

    return (
      <div
        ref={containerRef}
        className={`flex flex-col gap-1.5 relative ${containerClassName}`}>
        {label && (
          <label htmlFor={id} className="text-sm font-bold text-foreground">
            {label}
          </label>
        )}

        <div ref={ref} className="relative w-full">
          <button
            type="button"
            id={id}
            disabled={disabled}
            onClick={() => setIsOpen((prev) => !prev)}
            className={cn(
              "h-12 w-full flex items-center justify-between rounded-xl border border-input bg-background pl-4 pr-3.5 text-sm font-medium outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-border/80 disabled:cursor-not-allowed disabled:opacity-50 text-foreground cursor-pointer",
              error &&
                "border-destructive focus:ring-destructive/20 focus:border-destructive",
              className,
            )}>
            <span
              className={!selectedOption?.value ? "text-muted-foreground" : ""}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown
              className={`size-4.5 text-muted-foreground transition-transform duration-200 ${
                isOpen ? "rotate-180 text-primary" : ""
              }`}
            />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-full sm:w-auto sm:min-w-[220px] max-h-[600px] overflow-y-auto rounded-2xl border border-border bg-card p-2 shadow-xl backdrop-blur-md animate-in fade-in-80 zoom-in-95 duration-150">
              <div className="space-y-1">
                {parsedOptions.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={`w-full min-h-[44px] flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                        isSelected
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-foreground hover:bg-secondary/80 hover:text-foreground"
                      }`}>
                      <span className="truncate">{opt.label}</span>
                      {isSelected && (
                        <Check className="size-4 shrink-0 text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
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

Select.displayName = "Select";
export default Select;
