"use client";

import Link from "next/link";
import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { OrderCustomerDetailsProps } from "@/types/order.types";

export function OrderCustomerDetails({
  delivery,
  userId,
}: OrderCustomerDetailsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3 gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <User className="size-5 text-primary shrink-0" />
            <h2 className="font-serif text-lg font-bold text-foreground truncate">
              Customer &amp; Business Details
            </h2>
          </div>
          {userId?._id && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-8 gap-1.5 text-xs font-medium shrink-0">
              <Link href={ROUTES.USERS.DETAIL(userId?._id)}>
                <span>View Customer</span>
                <ExternalLink className="size-3.5" />
              </Link>
            </Button>
          )}
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <User className="size-4 text-muted-foreground shrink-0" />
              Contact Name
            </span>
            <span className="font-semibold text-foreground">
              {delivery?.contactPerson || userId?.name || "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Building2 className="size-4 text-muted-foreground shrink-0" />
              Business Name
            </span>
            <span className="font-semibold text-foreground">
              {delivery?.businessName || userId?.business || "Not Provided"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Mail className="size-4 text-muted-foreground shrink-0" />
              Email Address
            </span>
            <span className="font-mono font-medium text-foreground">
              {userId?.email || "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Phone className="size-4 text-muted-foreground shrink-0" />
              Contact Phone
            </span>
            <span className="font-mono font-medium text-foreground">
              {delivery?.phone || userId?.phone || "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="size-5 text-primary shrink-0" />
            <h2 className="font-serif text-lg font-bold text-foreground">
              Delivery Destination
            </h2>
          </div>
          {delivery?.businessName && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary truncate max-w-[45%]">
              {delivery.businessName}
            </span>
          )}
        </div>

        <div className="space-y-3 text-sm">
          {delivery?.address ? (
            <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-2.5">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-background p-2 border border-border/50 shrink-0 text-primary shadow-2xs mt-0.5">
                  <MapPin className="size-4" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  {delivery?.contactPerson && (
                    <p className="font-bold text-sm text-foreground">
                      {delivery.contactPerson}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {delivery.address}
                  </p>
                </div>
              </div>

              {delivery?.phone && (
                <div className="pt-2.5 mt-2 border-t border-border/40 flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <Phone className="size-3.5 text-muted-foreground/70" />
                  <span>{delivery.phone}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/60 p-6 text-center">
              <MapPin className="size-5 text-muted-foreground/40 mx-auto mb-1.5" />
              <p className="text-xs text-muted-foreground">
                No delivery address specified.
              </p>
            </div>
          )}

          {delivery?.notes && (
            <div className="rounded-xl border border-border/50 bg-muted/30 p-3 space-y-1">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <FileText className="size-3.5 text-primary" /> Delivery
                Instructions
              </span>
              <p className="text-xs text-foreground/90 italic pl-5 leading-relaxed">
                &ldquo;{delivery.notes}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
