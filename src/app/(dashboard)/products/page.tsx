"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { useProducts, useDeleteProduct } from "@/services/product/product.hook";
import { useCategories } from "@/services/category/category.hook";
import { DataTable, TableColumn } from "@/components/common/DataTable";
import { QueryBoundary } from "@/components/common/QueryBoundary";
import { RowActions } from "@/components/common/RowActions";
import { Pagination } from "@/components/common/Pagination";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { PageFilters } from "@/components/common/PageFilters";
import { PageHeader } from "@/components/common/PageHeader";
import { useProductFilters } from "@/hooks/useProductFilters";
import { ProductRow } from "@/types/product/product.types";
import { ROUTES } from "@/constants/routes";

const LIMIT = 10;

export default function ProductsPage() {
  const router = useRouter();
  const { page, search, category, setSearch, setCategory, setPage, clearAll } =
    useProductFilters();
  const [pendingDelete, setPendingDelete] = useState<ProductRow | null>(null);

  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
  } = useCategories({ limit: 100, isActive: true });

  const categoryOptions =
    categoriesData?.data?.categories?.map((cat: any) => ({
      value: cat?._id,
      label: cat?.name,
    })) || [];

  const { data, isLoading, isFetching, isError, error, refetch } = useProducts({
    page,
    limit: LIMIT,
    search: search?.trim() || undefined,
    categoryId: category || undefined,
  });
  const { mutate: deleteProduct } = useDeleteProduct();

  const handleRefetch = () => {
    refetchCategories();
    refetch();
  };

  const products: ProductRow[] = data?.data?.products ?? [];
  const total: number = data?.data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);

  const columns: TableColumn<ProductRow>[] = [
    {
      key: "name",
      header: "Name",
      className: "w-2/5",
      render: (row) => (
        <span className="font-semibold text-foreground">{row?.name}</span>
      ),
    },
    {
      key: "categoryId",
      header: "Category",
      className: "w-1/5",
      render: (row) => {
        const cat =
          typeof row?.categoryId === "object" ? row?.categoryId?.name : "-";
        return (
          <span className="text-sm font-medium text-foreground">{cat}</span>
        );
      },
    },
    {
      key: "pack",
      header: "Pack Size",
      className: "w-28",
      render: (row) => (
        <span className="text-sm text-foreground">{row?.pack}</span>
      ),
    },
    {
      key: "price",
      header: "Price",
      className: "w-28",
      render: (row) => (
        <span className="text-sm font-bold text-foreground">
          £{row?.price?.toFixed(2)}
        </span>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      className: "w-28",
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            row?.isActive
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-destructive/10 text-destructive"
          }`}>
          <span
            className={`size-1.5 rounded-full ${
              row?.isActive ? "bg-emerald-500" : "bg-destructive"
            }`}
          />
          {row?.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right w-20",
      render: (row) => (
        <RowActions
          id={`actions-${row?._id}`}
          actions={[
            {
              label: "View",
              icon: <Eye className="size-4" />,
              onClick: () => router.push(ROUTES.PRODUCTS.DETAIL(row?._id)),
            },
            {
              label: "Edit",
              icon: <Pencil className="size-4" />,
              onClick: () => router.push(ROUTES.PRODUCTS.EDIT(row?._id)),
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
        title="Products"
        subtitle={`${total} ${total === 1 ? "product" : "products"} total`}
        action={{
          id: "add-product-btn",
          label: "Add Product",
          icon: <Plus className="size-4" />,
          onClick: () => router.push(ROUTES.PRODUCTS.NEW),
        }}
      />

      <PageFilters
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search products by name..."
        categoryValue={category}
        onCategoryChange={setCategory}
        categoryOptions={categoryOptions}
        isLoadingCategories={isLoadingCategories}
        onClearFilters={clearAll}
        hasActiveFilters={!!search || !!category}
      />

      <QueryBoundary
        isLoading={false}
        isError={isError}
        error={error}
        refetch={handleRefetch}
        hasData={true}
        notFoundMessage="Failed to load products.">
        <DataTable
          columns={columns}
          data={products}
          isLoading={isFetching}
          skeletonCount={LIMIT}
          keyExtractor={(row) => row?._id}
          onRowClick={(row) => router.push(ROUTES.PRODUCTS.DETAIL(row?._id))}
          emptyMessage={
            search
              ? "No products match your search query."
              : "No products found. Create your first one!"
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
        description="This action cannot be undone. The product will be permanently removed."
        confirmText="Delete"
        variant="destructive"
        onConfirm={() => {
          if (pendingDelete) {
            deleteProduct(pendingDelete._id, {
              onSuccess: () => setPendingDelete(null),
            });
          }
        }}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
