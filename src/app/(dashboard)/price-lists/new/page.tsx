"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { PriceListForm } from "@/components/common/PriceListForm";
import { useCreatePriceListMutation } from "@/services/priceList/priceList.hook";
import { ROUTES } from "@/constants/routes";
import { PriceListFormData } from "@/types/priceList.types";

export default function CreatePriceListPage() {
  const router = useRouter();
  const createMutation = useCreatePriceListMutation();

  const handleCreate = (data: PriceListFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push(ROUTES.PRICE_LISTS.ROOT);
      },
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Create Price List"
        subtitle="Define special wholesale pricing for specific products and assign customers"
        showBack
        backHref={ROUTES.PRICE_LISTS.ROOT}
      />

      <PriceListForm
        onSubmit={handleCreate}
        isPending={createMutation.isPending}
        submitLabel="Save Price List"
        pendingLabel="Creating..."
      />
    </div>
  );
}
