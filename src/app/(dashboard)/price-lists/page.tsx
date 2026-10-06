"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ReceiptText, Package } from "lucide-react";
import { RowActions } from "@/components/common/RowActions";
import {
  usePriceListsQuery,
  useDeletePriceListMutation,
} from "@/services/priceList/priceList.hook";
import { DataTable, TableColumn } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { PageFilters } from "@/components/common/PageFilters";
import { QueryBoundary } from "@/components/common/QueryBoundary";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { PriceList } from "@/types/priceList.types";
import { ROUTES } from "@/constants/routes";
import { Pagination } from "@/components/common/Pagination";
import { formatDate } from "@/utils/format";

const LIMIT = 10;

export default function PriceListsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<PriceList | null>(null);

  const { data, isFetching, isError, error, refetch } = usePriceListsQuery({
    page,
    limit: LIMIT,
    search: search?.trim() || undefined,
  });

  const deleteMutation = useDeletePriceListMutation();

  const priceLists: PriceList[] = data?.data?.priceLists ?? [];
  const total: number = data?.data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT) || 1;

  const columns: TableColumn<PriceList>[] = [
    {
      key: "name",
      header: "Price List Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ReceiptText className="size-4" />
          </div>
          <div>
            <span className="font-semibold text-foreground block">
              {row?.name}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "productsCount",
      header: "Custom Products",
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
          <Package className="size-3.5 text-primary" />
          {row?.productsCount || row?.products?.length || 0} Products
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
              label: "Edit / Manage",
              icon: <Pencil className="size-4" />,
              onClick: () => router.push(ROUTES.PRICE_LISTS.DETAIL(row?._id)),
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
        title="Price Lists"
        subtitle={`${total} ${total === 1 ? "price list" : "price lists"} configured`}
        action={{
          id: "add-price-list-btn",
          label: "Create Price List",
          icon: <Plus className="size-4" />,
          onClick: () => router.push(ROUTES.PRICE_LISTS.NEW),
        }}
      />

      <PageFilters
        searchQuery={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        searchPlaceholder="Search price lists by name..."
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
        notFoundMessage="Failed to load price lists.">
        <DataTable
          columns={columns}
          data={priceLists}
          isLoading={isFetching}
          skeletonCount={LIMIT}
          keyExtractor={(row) => row?._id}
          onRowClick={(row) => router.push(ROUTES.PRICE_LISTS.DETAIL(row?._id))}
          emptyMessage={
            search
              ? "No price lists match your search filter."
              : "No price lists created yet. Create a price list to offer custom pricing to customers!"
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
        description="This will permanently delete this price list. Any customers assigned to this list will automatically revert to default catalog prices."
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (pendingDelete) {
            deleteMutation.mutate(pendingDelete._id, {
              onSuccess: () => setPendingDelete(null),
            });
          }
        }}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
