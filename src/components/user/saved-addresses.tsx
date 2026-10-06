import { MapPin, Phone } from "lucide-react";
import { Address } from "@/types/address.types";

export function SavedAddresses({ addresses = [] }: { addresses?: Address[] }) {
  const count = addresses?.length || 0;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-border/60">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            <h2 className="font-serif text-base font-bold text-foreground">
              Saved Delivery Addresses
            </h2>
          </div>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {count}
          </span>
        </div>

        <div className="pt-3">
          {count > 0 ? (
            <div className="space-y-2.5 max-h-[185px] overflow-y-auto pr-1 scrollbar-thin">
              {addresses.map((addr) => (
                <div
                  key={addr?._id}
                  className="rounded-xl border border-border/50 bg-muted/20 p-2.5 hover:bg-muted/30 transition-colors space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-foreground">
                      {addr?.fullName || "Recipient"}
                    </span>
                    {addr?.phone && (
                      <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                        <Phone className="size-3 text-muted-foreground/70" />
                        {addr.phone}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    {addr?.building ? `${addr.building}, ` : ""}
                    {addr?.streetAddress}, {addr?.city} - {addr?.postalCode}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 text-center">
              <MapPin className="size-5 text-muted-foreground/40 mb-1" />
              <p className="text-xs text-muted-foreground">
                No saved delivery addresses.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
