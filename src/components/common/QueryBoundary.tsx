"use client";

import React from "react";
import { Loader } from "./Loader";
import { ErrorView } from "./ErrorView";

interface QueryBoundaryProps {
  isLoading: boolean;
  isError: boolean;
  error: any;
  refetch: () => void;
  hasData: boolean;
  notFoundMessage?: string;
  loadingMinHeight?: string;
  loadingText?: string;
  children: React.ReactNode;
}

export function QueryBoundary({
  isLoading,
  isError,
  error,
  refetch,
  hasData,
  notFoundMessage = "Data not found.",
  loadingMinHeight = "min-h-[400px]",
  loadingText = "Loading details...",
  children,
}: QueryBoundaryProps) {
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${loadingMinHeight}`}>
        <Loader size="lg" text={loadingText} />
      </div>
    );
  }

  if (isError || !hasData) {
    return (
      <ErrorView
        message={(error as any)?.response?.data?.message ?? notFoundMessage}
        onRetry={refetch}
        className="mt-8"
      />
    );
  }

  return <>{children}</>;
}

export default QueryBoundary;
