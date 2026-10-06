import React, { useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  isLoading = false,
}: ConfirmModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      if (!isLoading) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (isLoading) return;
      if (e.target === dialog) {
        const rect = dialog.getBoundingClientRect();
        const isInside =
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width;
        if (!isInside) {
          onClose();
        }
      }
    };

    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("click", handleClickOutside);

    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("click", handleClickOutside);
    };
  }, [onClose, isLoading]);

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto w-full max-w-md h-fit rounded-2xl border border-border bg-card p-6 shadow-xl backdrop:bg-black/60 backdrop:backdrop-blur-sm text-card-foreground focus:outline-none animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-xl font-bold tracking-tight">
            {title}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg text-muted-foreground"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close dialog">
            <X className="size-4" />
          </Button>
        </div>

        <p className="text-sm leading-relaxed ">{description}</p>

        <div className="mt-2 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            disabled={isLoading}
            onClick={onConfirm}>
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </dialog>
  );
}

export default ConfirmModal;
