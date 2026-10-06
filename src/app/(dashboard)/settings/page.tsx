"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { AdminNotificationToggle } from "@/components/common/AdminNotificationToggle";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { LogOut, User as UserIcon, Mail, ShieldAlert } from "lucide-react";
import { STAFF_ROLE_LABELS } from "@/types/auth/auth.types";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const handleSignOut = () => {
    signOut().then(() => {
      router.push(ROUTES.LOGIN);
    });
  };

  const roleLabel =
    (user?.role && STAFF_ROLE_LABELS[user?.role]) || user?.role || "Staff";

  return (
    <div className="space-y-8 w-full max-w-4xl py-4">
      <div>
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-foreground">
          Settings & Profile
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your profile settings, notifications, and dashboard session.
        </p>
      </div>

      <AdminNotificationToggle />

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-foreground">
                {roleLabel} Profile
              </h2>
            </div>
          </div>
          <Button
            onClick={() => setConfirmSignOut(true)}
            variant="destructive"
            className="rounded-xl font-semibold gap-2">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2.5">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground font-medium">
                Full Name
              </span>
            </div>
            <span className="font-semibold text-foreground">{user?.name}</span>
          </div>

          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground font-medium">
                Email Address
              </span>
            </div>
            <span className="font-semibold text-foreground">{user?.email}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground font-medium">
                System Role
              </span>
            </div>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {roleLabel}
            </span>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmSignOut}
        onClose={() => setConfirmSignOut(false)}
        onConfirm={handleSignOut}
        title="Sign Out of Dashboard"
        description="Are you sure you want to log out?"
        confirmText="Sign Out"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
