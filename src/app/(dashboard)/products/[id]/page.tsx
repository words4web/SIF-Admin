"use client";

import { useParams, useRouter } from "next/navigation";
import { Pencil, Package, Layers, ImageIcon } from "lucide-react";
import { useProductDetail } from "@/services/product/product.hook";
import { QueryBoundary } from "@/components/common/QueryBoundary";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, isError, error, refetch } = useProductDetail(id);
  const product = data?.data;

  const nameEn =
    typeof product?.name === "object"
      ? product?.name?.en || product?.name?.it
      : product?.name;
  const nameIt =
    typeof product?.name === "object" && product?.name?.it !== nameEn
      ? product?.name?.it
      : null;

  const descEn =
    typeof product?.description === "object"
      ? product?.description?.en || product?.description?.it
      : product?.description;
  const descIt =
    typeof product?.description === "object" &&
    product?.description?.it !== descEn
      ? product?.description?.it
      : null;

  return (
    <QueryBoundary
      isLoading={isLoading}
      isError={isError}
      error={error}
      refetch={refetch}
      hasData={!!product}
      notFoundMessage="Product not found.">
      <div className="w-full space-y-8 animate-fade-in">
        <PageHeader
          title={nameEn || "Product Detail"}
          subtitle="View product information details"
          showBack={true}
          action={{
            id: "edit-product-btn",
            label: "Edit Product",
            icon: <Pencil className="size-4" />,
            onClick: () => router.push(ROUTES.PRODUCTS.EDIT(id)),
          }}
        />

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Package className="size-7" />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Product Name
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-foreground mt-0.5">
                    {nameEn}
                  </h2>
                  {nameIt && (
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                      <span className="text-xs">🇮🇹</span>
                      <span className="italic">{nameIt}</span>
                    </p>
                  )}
                </div>
              </div>
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold mt-1 ${
                  product?.isActive
                    ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                    : "bg-rose-500/10 text-rose-700 border-rose-500/30"
                }`}>
                {product?.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="flex flex-col gap-2 pt-6 border-t border-border/40">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ImageIcon className="size-3.5" /> Product Media (
                {product?.images?.length || 0})
              </span>
              {Array.isArray(product?.images) && product?.images?.length > 0 ? (
                <div className="flex flex-wrap gap-3 pt-1">
                  {product?.images?.map((imgUrl: string, idx: number) => (
                    <a
                      key={idx}
                      href={imgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-border/80 bg-muted/20 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 shrink-0 block"
                      title="Click to view full image">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl}
                        alt={`${nameEn || "Product"} Image ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No product images uploaded.
                </p>
              )}
            </div>

            <div className="space-y-4 pt-6 border-t border-border/40">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  URL path slug
                </span>
                <div className="bg-muted px-4 py-3 rounded-xl font-mono text-sm border border-border/30 text-foreground break-all">
                  {product?.slug}
                </div>
              </div>

              {(descEn || descIt) && (
                <div className="flex flex-col gap-3 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Description
                  </span>
                  {descEn && (
                    <div className="bg-muted/40 p-4 rounded-xl text-sm border border-border/30 text-foreground leading-relaxed whitespace-pre-wrap">
                      {descIt && (
                        <span className="font-bold text-xs text-muted-foreground uppercase block mb-1">
                          🇬🇧 English
                        </span>
                      )}
                      {descEn}
                    </div>
                  )}
                  {descIt && (
                    <div className="bg-muted/40 p-4 rounded-xl text-sm border border-border/30 text-foreground leading-relaxed whitespace-pre-wrap">
                      <span className="font-bold text-xs text-muted-foreground uppercase block mb-1">
                        🇮🇹 Italian
                      </span>
                      {descIt}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    SKU Code
                  </span>
                  <p className="text-base font-mono font-bold text-foreground mt-1 bg-muted/60 px-2.5 py-1 rounded inline-block">
                    {product?.sku || "N/A"}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Stock & Status
                  </span>
                  <div className="mt-1">
                    <p className="text-lg font-bold text-foreground">
                      {product?.stock ?? 0}{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        units
                      </span>
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                        product?.stockStatus === "OUT_OF_STOCK"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-emerald-500/10 text-emerald-700"
                      }`}>
                      {product?.stockStatus?.replace(/_/g, " ") || "IN STOCK"}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Category
                  </span>
                  <p className="text-base font-semibold text-foreground mt-1 flex items-center gap-2">
                    <Layers className="size-4 text-muted-foreground" />
                    {typeof product?.categoryId === "object" &&
                    product?.categoryId
                      ? typeof (product.categoryId as any).name === "object"
                        ? (product.categoryId as any).name?.en ||
                          (product.categoryId as any).name?.it ||
                          "-"
                        : (product.categoryId as any).name || "-"
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border/40">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Weight & Price Variants ({product?.variants?.length || 0})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Array.isArray(product?.variants) &&
                  product?.variants?.length > 0 ? (
                    product?.variants?.map((v: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-muted/30">
                        <span className="text-sm font-semibold text-foreground">
                          {v?.weight}g
                        </span>
                        <span className="text-base font-black text-primary">
                          €{Number(v?.price).toFixed(2)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground italic">
                      No variants available
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </QueryBoundary>
  );
}
