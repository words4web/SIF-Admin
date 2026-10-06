"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { RowActions } from "@/components/common/RowActions";
import {
  useCategories,
  useDeleteCategory,
} from "@/services/category/category.hook";
import { DataTable, TableColumn } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { PageFilters } from "@/components/common/PageFilters";
import { QueryBoundary } from "@/components/common/QueryBoundary";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { CategoryRow } from "@/types/category/category.types";
import { ROUTES } from "@/constants/routes";
import { Pagination } from "@/components/common/Pagination";
import { formatDate } from "@/utils/format";

const LIMIT = 10;

export default function CategoriesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<CategoryRow | null>(null);

  const { data, isFetching, isError, error, refetch } = useCategories({
    page,
    limit: LIMIT,
    search: search?.trim() || undefined,
  });
  const { mutate: deleteCategory } = useDeleteCategory();

  const categories: CategoryRow[] = data?.data?.categories ?? [];
  const total: number = data?.data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT) || 1;

  const columns: TableColumn<CategoryRow>[] = [
    {
      key: "image",
      header: "Image",
      className: "w-16",
      render: (row) => (
        <div className="size-11 rounded-xl overflow-hidden border border-border bg-muted/30 flex items-center justify-center shrink-0">
          {row?.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={row.image}
              alt={row.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              None
            </span>
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: "Name",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{row?.name}</span>
          {row?.tagline && (
            <span className="text-xs text-muted-foreground truncate max-w-xs sm:max-w-sm">
              {row.tagline}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      render: (row) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row?.slug}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            row?.isActive
              ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
              : "bg-muted text-muted-foreground border border-border/40"
          }`}>
          {row?.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "updatedAt",
      header: "Last Updated",
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(row?.updatedAt, { includeTime: true })}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right w-24",
      render: (row) => (
        <RowActions
          id={`actions-${row?._id}`}
          actions={[
            {
              label: "Edit",
              icon: <Pencil className="size-4" />,
              onClick: () => router.push(ROUTES.CATEGORIES.EDIT(row?._id)),
            },
            {
              label: "Delete",
              icon: <Trash2 className="size-4" />,
              variant: "danger",
              onClick: () => setPendingDelete(row),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        subtitle={`${total} ${total === 1 ? "category" : "categories"} total`}
        action={{
          id: "add-category-btn",
          label: "Add Category",
          icon: <Plus className="size-4" />,
          onClick: () => router.push(ROUTES.CATEGORIES.NEW),
        }}
      />

      <PageFilters
        searchQuery={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        searchPlaceholder="Search categories by name or slug..."
        onClearFilters={() => {
          setSearch("");
          setPage(1);
        }}
        hasActiveFilters={!!search}
      />

      <QueryBoundary
        isLoading={false}
        isError={isError}
        error={error}
        refetch={refetch}
        hasData={true}
        notFoundMessage="Failed to load categories.">
        <DataTable
          columns={columns}
          data={categories}
          isLoading={isFetching}
          skeletonCount={LIMIT}
          keyExtractor={(row) => row?._id}
          onRowClick={(row) => router.push(ROUTES.CATEGORIES.DETAIL(row?._id))}
          emptyMessage={
            search
              ? "No categories match your search filter."
              : "No categories found. Create your first one!"
          }
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isLoading={isFetching}
        />
      </QueryBoundary>

      <ConfirmModal
        isOpen={!!pendingDelete}
        title={`Delete "${pendingDelete?.name}"?`}
        description="This action cannot be undone. The category will be permanently removed."
        confirmText="Delete"
        variant="destructive"
        onConfirm={() => {
          if (pendingDelete) {
            deleteCategory(pendingDelete._id, {
              onSuccess: () => setPendingDelete(null),
            });
          }
        }}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
