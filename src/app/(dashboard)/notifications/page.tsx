"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useNotificationsQuery,
  useMarkReadMutation,
  useMarkAllReadMutation,
} from "@/services/notification/notification.hook";
import { QueryBoundary } from "@/components/common/QueryBoundary";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/common/Pagination";
import { NotificationCard } from "@/components/common/NotificationCard";
import { CheckCheck, Inbox } from "lucide-react";
import { NotificationItem } from "@/types/notification.types";
import { ROUTES } from "@/constants/routes";

const LIMIT = 10;

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useNotificationsQuery(page, LIMIT);

  const markReadMutation = useMarkReadMutation();
  const markAllReadMutation = useMarkAllReadMutation();

  const notifications: NotificationItem[] =
    data?.data?.notifications || data?.data?.docs || data?.data || [];
  const meta = data?.meta || {};
  const total = meta?.total || notifications.length;
  const totalPages = meta?.totalPages || Math.ceil(total / LIMIT) || 1;

  const hasUnread = notifications.some((n) => !n.isRead);

  const handleMarkAsRead = (e: React.MouseEvent, item: NotificationItem) => {
    e.stopPropagation();
    if (item?.isRead) return;
    markReadMutation.mutate(item._id);
  };

  const handleMarkAllAsRead = () => {
    markAllReadMutation.mutate();
  };

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item?.isRead) {
      markReadMutation.mutate(item._id);
    }
    const orderId = item?.metadata?.orderId;
    if (orderId) {
      router.push(ROUTES.ORDERS.DETAIL(orderId));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Notifications"
        subtitle="Live updates for new incoming wholesale order requests"
        action={
          hasUnread
            ? {
                label: "Mark all as read",
                icon: <CheckCheck className="size-4 text-primary" />,
                onClick: handleMarkAllAsRead,
                isLoading: markAllReadMutation.isPending,
              }
            : undefined
        }
      />

      <QueryBoundary
        isLoading={isLoading}
        isError={isError}
        error={error}
        refetch={refetch}
        hasData={true}
        loadingText="Loading notifications..."
        notFoundMessage="Failed to load notifications.">
        {notifications?.length === 0 ? (
          <div className="mx-auto mt-12 max-w-md rounded-2xl border border-dashed border-border p-10 text-center bg-card">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Inbox className="size-7" />
            </div>
            <h2 className="mt-4 font-serif text-xl font-bold text-foreground">
              No admin notifications
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              New customer order notifications and system alerts will appear
              here in real time.
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="space-y-2.5">
              {notifications?.map((item) => (
                <NotificationCard
                  key={item?._id}
                  item={item}
                  onClick={handleNotificationClick}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              isLoading={isFetching}
            />
          </div>
        )}
      </QueryBoundary>
    </div>
  );
}
