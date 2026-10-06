"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Check, Loader2, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownOption {
  value: string;
  label: string;
  sublabel?: string;
}

export interface PaginatedDropdownProps {
  value?: string[];
  onChange: (selectedValues: string[]) => void;
  fetchData: (params: {
    search: string;
    page: number;
    limit: number;
  }) => Promise<{
    options: DropdownOption[];
    hasMore: boolean;
  }>;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  limit?: number;
  className?: string;
  initialOptions?: DropdownOption[];
}

export function PaginatedDropdown({
  value = [],
  onChange,
  fetchData,
  placeholder = "Select options...",
  searchPlaceholder = "Search products...",
  disabled = false,
  limit = 10,
  className,
  initialOptions = [],
}: PaginatedDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [optionsMap, setOptionsMap] = useState<Map<string, DropdownOption>>(
    () => {
      const map = new Map<string, DropdownOption>();
      initialOptions.forEach((opt) => map.set(opt.value, opt));
      return map;
    },
  );
  const [page, setPage] = useState(1);
  const [options, setOptions] = useState<DropdownOption[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialOptions?.length > 0) {
      setOptionsMap((prev) => {
        const next = new Map(prev);
        initialOptions?.forEach((opt) => next.set(opt?.value, opt));
        return next;
      });
    }
  }, [initialOptions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!open) return;

    let isMounted = true;
    setLoading(true);

    fetchData({ search: debouncedSearch, page: 1, limit })
      .then((res) => {
        if (!isMounted) return;
        setOptions(res.options);
        setHasMore(res.hasMore);
        setPage(1);

        setOptionsMap((prev) => {
          const next = new Map(prev);
          res.options.forEach((opt) => next.set(opt.value, opt));
          return next;
        });
      })
      .catch(() => {
        if (!isMounted) return;
        setOptions([]);
        setHasMore(false);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [open, debouncedSearch, limit, fetchData]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadMore = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const res = await fetchData({
        search: debouncedSearch,
        page: nextPage,
        limit,
      });
      setOptions((prev) => [...prev, ...res.options]);
      setHasMore(res.hasMore);
      setPage(nextPage);

      setOptionsMap((prev) => {
        const next = new Map(prev);
        res.options.forEach((opt) => next.set(opt.value, opt));
        return next;
      });
    } catch (err) {
      console.error("Failed to load more options", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const toggleSelect = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value?.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={cn(
          "min-h-14 w-full rounded-xl border border-input bg-background p-2.5 flex flex-wrap items-center gap-2 cursor-pointer transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary",
          disabled && "opacity-50 cursor-not-allowed",
          open && "ring-2 ring-primary/20 border-primary",
        )}>
        <div className="flex-1 flex items-center">
          {value?.length > 0 ? (
            <span className="text-foreground text-sm font-semibold px-1">
              {value?.length}{" "}
              {value?.length === 1 ? "product selected" : "products selected"}
            </span>
          ) : (
            <span className="text-muted-foreground text-sm font-normal px-1">
              {placeholder}
            </span>
          )}
        </div>
        <ChevronsUpDown className="size-4 text-muted-foreground shrink-0 mr-1" />
      </div>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95">
          <div className="flex items-center border-b border-border px-3.5 py-2.5 bg-muted/30">
            <Search className="size-4 text-muted-foreground shrink-0 mr-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
            {loading && options?.length === 0 ? (
              <div className="py-8 flex items-center justify-center text-sm text-muted-foreground gap-2">
                <Loader2 className="size-4 animate-spin text-primary" />
                <span>Loading products...</span>
              </div>
            ) : options.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No products found.
              </div>
            ) : (
              options?.map((opt) => {
                const selected = value.includes(opt?.value);
                return (
                  <div
                    key={opt?.value}
                    onClick={() => toggleSelect(opt?.value)}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm cursor-pointer transition-colors",
                      selected
                        ? "bg-primary/10 text-primary font-bold"
                        : "hover:bg-accent hover:text-accent-foreground font-normal",
                    )}>
                    <div className="flex flex-col">
                      <span>{opt?.label}</span>
                      {opt?.sublabel && (
                        <span className="text-xs text-muted-foreground font-normal">
                          {opt?.sublabel}
                        </span>
                      )}
                    </div>
                    {selected && (
                      <Check className="size-4 text-primary shrink-0" />
                    )}
                  </div>
                );
              })
            )}

            {hasMore && (
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="w-full py-2.5 mt-1 text-xs font-bold text-primary hover:bg-primary/10 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer">
                {loadingMore ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Loading more...</span>
                  </>
                ) : (
                  "Load More Products"
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PaginatedDropdown;
