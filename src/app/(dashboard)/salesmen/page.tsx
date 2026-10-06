"use client";

import { useRouter } from "next/navigation";
import { Plus, Eye, CheckCircle2, XCircle } from "lucide-react";
import { useSalesman } from "@/hooks/useSalesman";
import { ISalesman } from "@/types/salesman.types";
import { DataTable, TableColumn } from "@/components/common/DataTable";
import { RowActions } from "@/components/common/RowActions";
import { PageHeader } from "@/components/common/PageHeader";
import { PageFilters } from "@/components/common/PageFilters";
import { QueryBoundary } from "@/components/common/QueryBoundary";
import { Pagination } from "@/components/common/Pagination";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { ROUTES } from "@/constants/routes";

const LIMIT = 10;

export default function SalesmenPage() {
  const router = useRouter();

  const {
    salesmen,
    total,
    totalPages,
    isFetching,
    isError,
    error,
    refetch,
    filters,
    isUpdatingStatus,
    statusConfirm,
    setStatusConfirm,
    handleToggleStatus,
  } = useSalesman({ mode: "list", limit: LIMIT });

  const { page, search, setSearch, setPage, clearAll } = filters;

  const columns: TableColumn<ISalesman>[] = [
    {
      key: "fullName",
      header: "Salesman",
      render: (row) => (
        <span className="font-semibold text-foreground">{row?.fullName}</span>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (row) => (
        <span className="text-sm text-muted-foreground">{row?.email}</span>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      className: "w-28",
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${
            row?.isActive
              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
              : "bg-rose-500/10 text-rose-700 border-rose-500/30"
          }`}>
          {row?.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row?.createdAt
            ? new Date(row?.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "N/A"}
        </span>
      ),
    },
    {
      key: "_id",
      header: "Actions",
      className: "text-right w-20",
      render: (row) => (
        <RowActions
          id={`actions-${row?._id}`}
          actions={[
            {
              label: "View / Edit",
              icon: <Eye className="size-4" />,
              onClick: () => router.push(ROUTES.SALESMEN.DETAIL(row?._id)),
            },
            {
              label: row?.isActive ? "Deactivate" : "Activate",
              icon: row?.isActive ? (
                <XCircle className="size-4 text-rose-500" />
              ) : (
                <CheckCircle2 className="size-4 text-emerald-500" />
              ),
              variant: row?.isActive ? "danger" : "default",
              onClick: () =>
                setStatusConfirm({
                  id: row?._id,
                  fullName: row?.fullName,
                  currentStatus: !!row?.isActive,
                }),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Salesmen"
        subtitle={`${total} ${total === 1 ? "account" : "accounts"} total`}
        action={{
          label: "Add Salesman",
          icon: <Plus className="size-4 mr-1" />,
          onClick: () => router.push(ROUTES.SALESMEN.NEW),
          variant: "default",
          id: "add-salesman-btn",
        }}
      />

      <PageFilters
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name or email..."
        onClearFilters={clearAll}
        hasActiveFilters={!!search}
      />

      <QueryBoundary
        isLoading={false}
        isError={isError}
        error={error}
        refetch={refetch}
        hasData={true}
        notFoundMessage="Failed to load salesmen.">
        <DataTable
          columns={columns}
          data={salesmen}
          isLoading={isFetching}
          skeletonCount={LIMIT}
          keyExtractor={(row) => row._id}
          onRowClick={(row) => router.push(ROUTES.SALESMEN.DETAIL(row._id))}
          emptyMessage={
            search
              ? "No salesmen match your search."
              : "No salesman accounts created yet."
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
        isOpen={!!statusConfirm}
        onClose={() => setStatusConfirm(null)}
        onConfirm={() =>
          statusConfirm &&
          handleToggleStatus(statusConfirm.id, statusConfirm.currentStatus)
        }
        title={
          statusConfirm?.currentStatus
            ? "Deactivate Account"
            : "Activate Account"
        }
        description={
          statusConfirm?.currentStatus
            ? `Are you sure you want to deactivate ${statusConfirm.fullName}'s account?`
            : `Activate ${statusConfirm?.fullName}'s account?`
        }
        confirmText={statusConfirm?.currentStatus ? "Deactivate" : "Activate"}
        variant={statusConfirm?.currentStatus ? "destructive" : "default"}
        isLoading={isUpdatingStatus}
      />
    </div>
  );
}
