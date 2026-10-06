"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  useUsersQuery,
  useUpdateUserStatusMutation,
} from "@/services/user/user.hook";
import { DataTable, TableColumn } from "@/components/common/DataTable";
import { RowActions } from "@/components/common/RowActions";
import { PageHeader } from "@/components/common/PageHeader";
import { PageFilters } from "@/components/common/PageFilters";
import { QueryBoundary } from "@/components/common/QueryBoundary";
import { Pagination } from "@/components/common/Pagination";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { ROUTES } from "@/constants/routes";

const LIMIT = 10;

export default function UsersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusConfirmUser, setStatusConfirmUser] = useState<{
    id: string;
    fullName: string;
    currentStatus: boolean;
  } | null>(null);

  const {
    data: responseBody,
    isFetching,
    isError,
    error,
    refetch,
  } = useUsersQuery({
    page,
    limit: LIMIT,
    search: searchTerm?.trim() || undefined,
  });

  const users = responseBody?.data || [];
  const meta = responseBody?.meta || { totalPages: 1, total: 0 };
  const total = meta?.totalCount || meta?.total || users.length;
  const totalPages = meta?.totalPages || Math.ceil(total / LIMIT) || 1;

  const updateStatusMutation = useUpdateUserStatusMutation();

  const handleConfirmStatusChange = () => {
    if (!statusConfirmUser) return;
    const newStatus = !statusConfirmUser.currentStatus;
    updateStatusMutation.mutate(
      { id: statusConfirmUser.id, isActive: newStatus },
      {
        onSuccess: () => {
          toast.success(
            `Account ${newStatus ? "activated" : "deactivated"} successfully.`,
          );
          setStatusConfirmUser(null);
        },
        onError: (err: any) => {
          toast.error(
            err.response?.data?.message || `Failed to update status.`,
          );
        },
      },
    );
  };

  const columns: TableColumn<any>[] = [
    {
      key: "fullName",
      header: "Customer Name",
      render: (row) => (
        <div>
          <span className="font-semibold text-foreground">{row.fullName}</span>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: "businessName",
      header: "Business Name",
      render: (row) => (
        <span className="font-medium text-foreground">
          {row.businessName || "N/A"}
        </span>
      ),
    },
    {
      key: "mobileNumber",
      header: "Mobile Number",
      render: (row) => (
        <span className="text-sm font-mono text-muted-foreground">
          {row.mobileNumber || "N/A"}
        </span>
      ),
    },
    {
      key: "isActive",
      header: "Account Status",
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            row.isActive
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
          }`}>
          {row.isActive ? "Active" : "Pending Approval"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Joined Date",
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.createdAt
            ? new Date(row.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "N/A"}
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
              onClick: () => router.push(ROUTES.USERS.DETAIL(row?._id)),
            },
            {
              label: row.isActive ? "Deactivate" : "Approve",
              icon: row.isActive ? (
                <XCircle className="size-4 text-rose-500" />
              ) : (
                <CheckCircle2 className="size-4 text-emerald-500" />
              ),
              variant: row.isActive ? "danger" : "default",
              onClick: () =>
                setStatusConfirmUser({
                  id: row._id,
                  fullName: row.fullName || "this customer",
                  currentStatus: !!row.isActive,
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
        title="Customer Accounts"
        subtitle={`${total} ${total === 1 ? "account" : "accounts"} total`}
      />

      <PageFilters
        searchQuery={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        searchPlaceholder="Search by name, business, email..."
        onClearFilters={() => {
          setSearchTerm("");
          setPage(1);
        }}
        hasActiveFilters={!!searchTerm}
      />

      <QueryBoundary
        isLoading={false}
        isError={isError}
        error={error}
        refetch={refetch}
        hasData={true}
        notFoundMessage="Failed to load customer accounts.">
        <DataTable
          columns={columns}
          data={users}
          isLoading={isFetching}
          skeletonCount={LIMIT}
          keyExtractor={(row) => row._id}
          onRowClick={(row) => router.push(ROUTES.USERS.DETAIL(row._id))}
          emptyMessage={
            searchTerm
              ? "No customer accounts match your search filter."
              : "No registered customer accounts found."
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
        isOpen={!!statusConfirmUser}
        onClose={() => setStatusConfirmUser(null)}
        onConfirm={handleConfirmStatusChange}
        title={
          statusConfirmUser?.currentStatus
            ? "Deactivate Account"
            : "Approve & Activate Account"
        }
        description={
          statusConfirmUser?.currentStatus
            ? `Are you sure you want to deactivate ${statusConfirmUser.fullName}'s account? They will be logged out and cannot place orders.`
            : `Are you sure you want to approve and activate ${statusConfirmUser?.fullName}'s account? They will be able to log in and place orders.`
        }
        confirmText={
          statusConfirmUser?.currentStatus ? "Deactivate" : "Approve Account"
        }
        variant={statusConfirmUser?.currentStatus ? "destructive" : "default"}
        isLoading={updateStatusMutation.isPending}
      />
    </div>
  );
}
