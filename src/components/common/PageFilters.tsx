import { useState, useEffect } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Select } from "@/components/common/Select";
import { PageFiltersProps } from "@/types/common.types";
import { useDebounce } from "@/hooks/useDebounce";

export function PageFilters({
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  categoryValue,
  onCategoryChange,
  categoryOptions = [],
  categoryPlaceholder = "All Categories",
  isLoadingCategories = false,
  extraFilters,
  onClearFilters,
  hasActiveFilters = false,
}: PageFiltersProps) {
  const [inputValue, setInputValue] = useState(searchQuery);
  const debouncedValue = useDebounce(inputValue, 500);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedValue !== searchQuery) {
      onSearchChange?.(debouncedValue);
    }
  }, [debouncedValue]);

  const isFiltered =
    hasActiveFilters || !!inputValue?.trim() || !!categoryValue;

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full p-1 bg-background/50 rounded-2xl">
      <div className="relative flex-1 min-w-[240px] max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-10 w-full rounded-xl border border-input bg-card pl-9 pr-8 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {!!inputValue?.trim() && (
          <button
            type="button"
            onClick={() => {
              setInputValue("");
              onSearchChange?.("");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Clear search">
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2.5 sm:justify-end">
        {(onCategoryChange || categoryOptions.length > 0) && (
          <div className="min-w-[170px] flex-1 sm:flex-initial">
            <Select
              value={categoryValue || ""}
              onChange={(e) => onCategoryChange?.(e.target.value)}
              options={[
                { value: "", label: categoryPlaceholder },
                ...categoryOptions,
              ]}
              disabled={isLoadingCategories}
              placeholder={categoryPlaceholder}
              className="h-10 text-xs sm:text-sm bg-card rounded-xl"
            />
          </div>
        )}

        {extraFilters}

        {isFiltered && (
          <button
            type="button"
            onClick={onClearFilters}
            className="h-10 px-3.5 rounded-xl border border-border bg-card text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all flex items-center gap-1.5 cursor-pointer shrink-0">
            <SlidersHorizontal className="size-3.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default PageFilters;
