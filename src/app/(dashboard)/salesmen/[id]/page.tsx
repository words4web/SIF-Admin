"use client";

import { useParams } from "next/navigation";
import { Save, User, CheckCircle2, XCircle } from "lucide-react";
import { useSalesman } from "@/hooks/useSalesman";
import { SalesmanForm } from "@/components/salesman/SalesmanForm";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { QueryBoundary } from "@/components/common/QueryBoundary";

export default function SalesmanDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const {
    salesman,
    isLoading,
    isError,
    error,
    refetch,
    isSaving,
    isBusy,
    isFormDirty,
    setIsFormDirty,
    showSaveModal,
    setShowSaveModal,
    showDiscardModal,
    setShowDiscardModal,
    statusConfirm,
    setStatusConfirm,
    handleBack,
    handleConfirmDiscard,
    handleSubmitForm,
    handleConfirmSave,
    handleToggleStatus,
  } = useSalesman({ id, mode: "edit" });

  return (
    <QueryBoundary
      isLoading={isLoading}
      isError={isError}
      error={error}
      refetch={refetch}
      hasData={!!salesman}
      notFoundMessage="Salesman not found.">
      <PageHeader
        title={salesman?.fullName || "Salesman Details"}
        subtitle={salesman?.email}
        showBack
        onBackClick={handleBack}
        action={{
          label: "Save Changes",
          icon: <Save className="size-4 mr-1" />,
          type: "submit",
          form: "salesman-form",
          variant: "default",
          id: "save-salesman-btn",
          isLoading: isSaving,
          disabled: isBusy || !isFormDirty,
        }}
      />

      <div className="flex flex-col items-center justify-center min-h-[55vh]">
        <div className="w-full max-w-4xl space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <User className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-foreground">
                    {salesman?.fullName}
                  </p>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                      salesman?.isActive
                        ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                        : "bg-rose-500/10 text-rose-700 border-rose-500/30"
                    }`}>
                    {salesman?.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {salesman?.email}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setStatusConfirm({
                  id: salesman?._id,
                  currentStatus: salesman?.isActive,
                })
              }
              disabled={isBusy}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer select-none ${
                salesman?.isActive
                  ? "border-rose-500/30 text-rose-600 bg-rose-500/10 hover:bg-rose-500/20"
                  : "border-emerald-500/30 text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20"
              }`}>
              {salesman?.isActive ? (
                <>
                  <XCircle className="size-4" /> Deactivate Account
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" /> Activate Account
                </>
              )}
            </button>
          </div>

          <SalesmanForm
            key={salesman?._id}
            mode="edit"
            defaultValues={{
              fullName: salesman?.fullName,
              email: salesman?.email,
              permissions: salesman?.permissions || [],
            }}
            onSubmit={handleSubmitForm}
            onDirtyChange={setIsFormDirty}
            disabled={isBusy}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={showSaveModal}
        onClose={() => !isBusy && setShowSaveModal(false)}
        onConfirm={handleConfirmSave}
        isLoading={isSaving}
        title="Save Changes?"
        description="Are you sure you want to update this salesman's profile and permissions?"
        confirmText="Save Changes"
        cancelText="Cancel"
        variant="default"
      />

      <ConfirmModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={handleConfirmDiscard}
        title="Discard Unsaved Changes?"
        description="You have unsaved changes. Are you sure you want to discard them and leave?"
        confirmText="Discard Changes"
        cancelText="Keep Editing"
        variant="destructive"
      />

      <ConfirmModal
        isOpen={!!statusConfirm}
        onClose={() => !isBusy && setStatusConfirm(null)}
        onConfirm={() =>
          statusConfirm &&
          handleToggleStatus(statusConfirm.id, statusConfirm.currentStatus)
        }
        isLoading={isBusy}
        title={
          statusConfirm?.currentStatus
            ? "Deactivate Salesman?"
            : "Activate Salesman?"
        }
        description={
          statusConfirm?.currentStatus
            ? "This will prevent the salesman from logging in or performing any actions."
            : "This will re-enable access for this salesman."
        }
        confirmText={statusConfirm?.currentStatus ? "Deactivate" : "Activate"}
        variant={statusConfirm?.currentStatus ? "destructive" : "default"}
      />
    </QueryBoundary>
  );
}
