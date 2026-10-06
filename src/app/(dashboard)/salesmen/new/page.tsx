"use client";

import { UserPlus } from "lucide-react";
import { useSalesman } from "@/hooks/useSalesman";
import { SalesmanForm } from "@/components/salesman/SalesmanForm";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmModal } from "@/components/common/ConfirmModal";

export default function NewSalesmanPage() {
  const {
    isSaving,
    isBusy,
    showSaveModal,
    setShowSaveModal,
    showDiscardModal,
    setShowDiscardModal,
    pendingValues,
    setIsFormDirty,
    handleBack,
    handleConfirmDiscard,
    handleSubmitForm,
    handleConfirmSave,
  } = useSalesman({ mode: "create" });

  return (
    <>
      <PageHeader
        title="Add Salesman"
        subtitle="Create a new salesman account and assign permissions"
        showBack
        onBackClick={handleBack}
        action={{
          label: "Create Account",
          icon: <UserPlus className="size-4 mr-1" />,
          type: "submit",
          form: "salesman-form",
          variant: "default",
          id: "create-salesman-btn",
          isLoading: isSaving,
          disabled: isBusy,
        }}
      />
      <div className="flex flex-col items-center justify-center min-h-[55vh]">
        <div className="w-full max-w-4xl">
          <SalesmanForm
            mode="create"
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
        title="Create Salesman Account?"
        description={`Are you sure you want to create an account for ${pendingValues?.fullName || "this salesman"} with ${pendingValues?.permissions.length || 0} assigned permission(s)?`}
        confirmText="Create Account"
        cancelText="Cancel"
        variant="default"
      />

      <ConfirmModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={handleConfirmDiscard}
        title="Discard Unsaved Changes?"
        description="You have unsaved changes in the form. Are you sure you want to leave without creating the account?"
        confirmText="Discard Changes"
        cancelText="Keep Editing"
        variant="destructive"
      />
    </>
  );
}
