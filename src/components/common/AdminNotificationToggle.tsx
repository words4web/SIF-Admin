"use client";

import { useState } from "react";
import { Bell, BellOff, Settings } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setPermissionStatus, setToggledOn } from "@/store/notificationSlice";
import { STORAGE_KEYS } from "@/constants/storage";

export function AdminNotificationToggle({
  className = "",
}: {
  className?: string;
}) {
  const dispatch = useDispatch();
  const { permissionStatus, isToggledOn } = useSelector(
    (state: RootState) => state.notification,
  );
  const [isBusy, setIsBusy] = useState(false);

  const isEnabled = permissionStatus === "granted" && isToggledOn;
  const isDenied = permissionStatus === "denied";
  const isUnsupported = permissionStatus === "unsupported";

  const handleEnable = async () => {
    setIsBusy(true);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, "true");
      }

      if (typeof window !== "undefined" && "Notification" in window) {
        let permission = Notification.permission;
        if (permission === "default") {
          permission = await Notification.requestPermission();
        }

        dispatch(setPermissionStatus(permission));

        if (permission === "granted") {
          dispatch(setToggledOn(true));
        } else {
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, "false");
          }
          dispatch(setToggledOn(false));
        }
      } else {
        dispatch(setPermissionStatus("unsupported"));
      }
    } catch (err) {
      console.error("[AdminNotificationToggle] Enable error:", err);
    } finally {
      setIsBusy(false);
    }
  };

  const handleDisable = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, "false");
    }
    dispatch(setToggledOn(false));
  };

  const handleToggle = () => {
    if (isEnabled) {
      handleDisable();
    } else {
      handleEnable();
    }
  };

  if (isUnsupported) {
    return (
      <div
        className={`flex items-center gap-3 rounded-xl border border-border/50 bg-muted/40 px-4 py-3 ${className}`}>
        <BellOff className="size-5 text-muted-foreground shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">
            Push Notifications
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Notifications are not supported in your browser.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/80 p-5 shadow-xs ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`size-10 shrink-0 rounded-xl flex items-center justify-center ${
              isEnabled
                ? "bg-primary/15 text-primary"
                : "bg-muted text-muted-foreground"
            }`}>
            {isEnabled ? (
              <Bell className="size-5" />
            ) : (
              <BellOff className="size-5" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground">
              New Order Notifications
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isDenied
                ? "Permission denied in browser settings"
                : isEnabled
                  ? "Push notifications enabled for new wholesale orders"
                  : "Receive instant push alerts when new orders are submitted"}
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isEnabled}
          onClick={handleToggle}
          disabled={isDenied || isBusy}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 ${
            isEnabled ? "bg-primary" : "bg-muted-foreground/30"
          }`}>
          <span
            className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              isEnabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {isDenied && (
        <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 px-3.5 py-3">
          <Settings className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            Notifications are blocked by your browser. Please allow
            notifications in your browser settings to receive real-time order
            alerts.
          </p>
        </div>
      )}
    </div>
  );
}
