import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3)
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];

  return [1, "...", current - 1, current, current + 1, "...", total];
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  if (totalPages <= 1 && !isLoading) return null;

  const pages = getPageNumbers(page, totalPages);

  const btnBase =
    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer";
  const pageBtn = `${btnBase} size-9 border border-border bg-card hover:bg-muted text-foreground`;
  const activeBtn = `${btnBase} size-9 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 border border-primary`;
  const navBtn = `${btnBase} h-9 px-3 gap-1.5 border border-border bg-card hover:bg-muted text-foreground`;

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">
        Page <span className="font-semibold text-foreground">{page}</span> of{" "}
        <span className="font-semibold text-foreground">{totalPages}</span>
      </span>

      <div className="flex items-center gap-1">
        <button
          id="prev-page-btn"
          disabled={page === 1 || isLoading}
          onClick={() => onPageChange(page - 1)}
          className={navBtn}>
          <ChevronLeft className="size-3.5" />
          Prev
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="size-9 inline-flex items-center justify-center text-muted-foreground">
              <MoreHorizontal className="size-4" />
            </span>
          ) : (
            <button
              key={p}
              id={`page-${p}-btn`}
              disabled={isLoading}
              onClick={() => onPageChange(p as number)}
              className={p === page ? activeBtn : pageBtn}>
              {p}
            </button>
          ),
        )}

        <button
          id="next-page-btn"
          disabled={page === totalPages || isLoading}
          onClick={() => onPageChange(page + 1)}
          className={navBtn}>
          Next
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
