"use client";

import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Skeleton } from "./Skeleton";

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  sortKey?: string;
  sortDir?: "asc" | "desc";
  onSort?: (key: string) => void;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  isLoading?: boolean;
  skeletonCount?: number;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  sortKey,
  sortDir,
  onSort,
  onRowClick,
  emptyMessage = "No data found.",
  isLoading = false,
  skeletonCount = 10,
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full table-fixed text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {columns?.map((col) => (
              <th
                key={String(col?.key)}
                onClick={() => col?.sortable && onSort?.(String(col?.key))}
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none ${col?.sortable ? "cursor-pointer hover:text-foreground transition-colors" : ""} ${col?.className ?? ""}`}>
                <div className="flex items-center gap-1">
                  {col?.header}
                  {col?.sortable && (
                    <span className="flex flex-col ml-1 opacity-50">
                      <ChevronUp
                        className={`size-3 -mb-1 ${sortKey === String(col?.key) && sortDir === "asc" ? "opacity-100 text-primary" : ""}`}
                      />
                      <ChevronDown
                        className={`size-3 ${sortKey === String(col?.key) && sortDir === "desc" ? "opacity-100 text-primary" : ""}`}
                      />
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: skeletonCount }).map((_, index) => (
              <tr
                key={`skeleton-${index}`}
                className="border-b border-border/50 last:border-0">
                {columns?.map((col) => {
                  const isAction = col.key === "actions";
                  const isStatus =
                    col.key === "isActive" || col.key === "status";

                  return (
                    <td
                      key={String(col.key)}
                      className={`px-4 py-3.5 ${col.className ?? ""}`}>
                      {isAction ? (
                        <div className="flex justify-end">
                          <Skeleton className="h-7 w-7 rounded-lg" />
                        </div>
                      ) : isStatus ? (
                        <Skeleton className="h-6 w-16 rounded-full inline-block" />
                      ) : (
                        <Skeleton className="h-4.5 w-full max-w-[80%] rounded" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : data?.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-muted-foreground">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data?.map((row, idx) => (
              <tr
                key={keyExtractor(row, idx)}
                onClick={() => onRowClick?.(row)}
                className={`group border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}>
                {columns?.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`px-4 py-3 text-foreground ${col.className ?? ""}`}>
                    {col.render
                      ? col.render(row)
                      : String((row as any)[col.key] ?? "-")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
