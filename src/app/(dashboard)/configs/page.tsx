"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { QueryBoundary } from "@/components/common/QueryBoundary";
import { ShippingConfigSection } from "@/components/settings/ShippingConfigSection";
import { useAdminConfigQuery } from "@/services/config/config.hook";

export default function ConfigPage() {
  const {
    data: config,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminConfigQuery();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuration"
        subtitle="Manage global store settings and dynamic shipping configurations"
      />

      <QueryBoundary
        isLoading={isLoading}
        isError={isError}
        error={error}
        refetch={refetch}
        hasData={!!config}
        notFoundMessage="Failed to load configuration.">
        <ShippingConfigSection initialConfig={config?.shipping} />
      </QueryBoundary>
    </div>
  );
}
