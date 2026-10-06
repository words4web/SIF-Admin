"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, PlusCircle } from "lucide-react";
import { useAdminOrdersQuery } from "@/services/order/order.hook";
import { DataTable, TableColumn } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { PageFilters } from "@/components/common/PageFilters";
import { QueryBoundary } from "@/components/common/QueryBoundary";
import { Pagination } from "@/components/common/Pagination";
import { formatPounds } from "@/lib/format";
import { formatDate } from "@/utils/format";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { EStaffRole } from "@/types/auth/auth.types";

const LIMIT = 10;

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const canCreateOrder =
    user?.role === EStaffRole.SUPER_ADMIN ||
    user?.role === EStaffRole.SUB_ADMIN ||
    (Array.isArray(user?.permissions) &&
      user.permissions.includes("order_create"));

  const {
    data: responseBody,
    isFetching,
    isError,
    error,
    refetch,
  } = useAdminOrdersQuery({
    page,
    limit: LIMIT,
    search: searchTerm?.trim() || undefined,
    status: statusFilter || undefined,
  });

  const ordersData = responseBody?.data;
  const orders = ordersData?.orders || [];
  const total = ordersData?.total || 0;
  const totalPages = ordersData?.totalPages || 1;

  const columns: TableColumn<any>[] = [
    {
      key: "orderId",
      header: "Order ID",
      render: (row) => (
        <span className="font-serif font-bold text-foreground">
          {row.orderId}
        </span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (row) => (
        <div>
          <p className="font-semibold text-foreground">
            {row.delivery?.contactPerson || row.userId?.name || "Customer"}
          </p>
          <p className="text-xs text-muted-foreground">
            {row.delivery?.businessName ||
              row.userId?.business ||
              "No business"}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const statusColors: Record<string, string> = {
          IN_PROCESS: "bg-amber-500/10 text-amber-600 border-amber-500/20",
          DELIVERED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        };
        const statusLabels: Record<string, string> = {
          IN_PROCESS: "In Process",
          DELIVERED: "Delivered",
        };
        return (
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
              statusColors[row.status] ||
              "bg-secondary text-secondary-foreground"
            }`}>
            {statusLabels[row.status] || row.status}
          </span>
        );
      },
    },
    {
      key: "itemsCount",
      header: "Items",
      render: (row) => {
        const count = row?.items?.length || 0;
        return <span className="font-semibold">{count}</span>;
      },
    },
    {
      key: "total",
      header: "Total",
      render: (row) => (
        <span className="font-serif font-extrabold text-foreground">
          {formatPounds(row.total)}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date Placed",
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(row.createdAt, { includeTime: true })}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right w-24",
      render: (row) => (
        <div className="flex justify-end">
          <Link
            href={ROUTES.ORDERS.DETAIL(row._id)}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary">
            <Eye className="size-3.5" /> View
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        subtitle={`${total} ${total === 1 ? "order request" : "order requests"} total`}
        action={
          canCreateOrder
            ? {
                label: "Create Order",
                onClick: () => router.push(ROUTES.ORDERS.NEW),
                icon: <PlusCircle className="size-4 mr-1.5" />,
                variant: "default",
              }
            : undefined
        }
      />

      <PageFilters
        searchQuery={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        searchPlaceholder="Search by order ID, name, business..."
        categoryValue={statusFilter}
        onCategoryChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        categoryOptions={[
          { value: "IN_PROCESS", label: "In Process" },
          { value: "DELIVERED", label: "Delivered" },
        ]}
        categoryPlaceholder="All Statuses"
        onClearFilters={() => {
          setSearchTerm("");
          setStatusFilter("");
          setPage(1);
        }}
        hasActiveFilters={!!searchTerm || !!statusFilter}
      />

      <QueryBoundary
        isLoading={false}
        isError={isError}
        error={error}
        refetch={refetch}
        hasData={true}
        notFoundMessage="Failed to load orders.">
        <DataTable
          columns={columns}
          data={orders}
          isLoading={isFetching}
          skeletonCount={LIMIT}
          keyExtractor={(row) => row?._id}
          onRowClick={(row) => router.push(ROUTES.ORDERS.DETAIL(row._id))}
          emptyMessage={
            searchTerm || statusFilter
              ? "No order requests match your filter criteria."
              : "No wholesale order requests found."
          }
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isLoading={isFetching}
        />
      </QueryBoundary>
    </div>
  );
}
