"use client";

import { useState } from "react";
import {
  User as UserIcon,
  MapPin,
  Building2,
  Phone,
  Mail,
  Check,
} from "lucide-react";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { useUsersQuery, useUserDetailQuery } from "@/services/user/user.hook";
import { CustomerSelectorProps } from "@/types/order.types";
import { useDebounce } from "@/hooks/useDebounce";
import { formatAddress, getAddressOptions } from "@/utils/format";

export function CustomerSelector({
  selectedUserId,
  selectedAddressId,
  onSelectCustomer,
  onSelectAddress,
}: CustomerSelectorProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const debouncedSearch = useDebounce(search.trim(), 300);
  const hasSearch = debouncedSearch.length >= 2;

  const { data: usersResponse, isFetching: isSearching } = useUsersQuery(
    {
      search: debouncedSearch || undefined,
      limit: 20,
    },
    hasSearch,
  );

  const rawData = usersResponse?.data;
  const users: any[] = Array.isArray(rawData) ? rawData : rawData?.users || [];

  const { data: userDetailResponse } = useUserDetailQuery(
    selectedUserId,
    !!selectedUserId,
  );

  const selectedUser = userDetailResponse?.data?.user;
  const addresses: any[] = selectedUser?.addresses || [];

  const addressOptions = getAddressOptions(addresses, selectedUser?.fullName);
  const selectedAddressObj = addresses?.find(
    (a) => a?._id === selectedAddressId,
  );
  const formattedSelectedAddress = selectedAddressObj
    ? formatAddress(selectedAddressObj)
    : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-2.5 pb-3 border-b border-border">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <UserIcon className="size-4.5" />
        </div>
        <div>
          <h2 className="font-serif text-base font-bold text-foreground">
            Customer & Delivery Address
          </h2>
          <p className="text-xs text-muted-foreground">
            Select customer to place order on their behalf
          </p>
        </div>
      </div>

      <div className="relative">
        <label className="text-xs font-semibold text-foreground mb-1.5 block">
          Search Customer
        </label>
        <Input
          placeholder="Search by customer name, email, or business..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />

        {isOpen && search?.trim()?.length > 0 && (
          <div className="absolute top-[calc(100%+4px)] left-0 z-30 w-full max-h-60 overflow-y-auto rounded-xl border border-border bg-card p-1.5 shadow-xl">
            {search?.trim().length < 2 ? (
              <div className="p-3 text-center text-xs text-muted-foreground">
                Type at least 2 characters to search...
              </div>
            ) : isSearching ? (
              <div className="p-3 text-center text-xs text-muted-foreground">
                Searching customers...
              </div>
            ) : users.length === 0 ? (
              <div className="p-3 text-center text-xs text-muted-foreground">
                No customers found.
              </div>
            ) : (
              users?.map((u: any) => (
                <button
                  key={u?._id}
                  type="button"
                  onClick={() => {
                    onSelectCustomer(u._id);
                    setSearch(`${u?.fullName || u?.name} (${u?.email})`);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                    selectedUserId === u?._id
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-secondary text-foreground"
                  }`}>
                  <div className="min-w-0 pr-2">
                    <p className="text-sm font-semibold truncate">
                      {u?.fullName || u?.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {u?.businessName || u?.business
                        ? `${u?.businessName || u?.business} • `
                        : ""}
                      {u?.email}
                    </p>
                  </div>
                  {selectedUserId === u?._id && (
                    <Check className="size-4 shrink-0 text-primary" />
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="space-y-4 pt-2">
          <div className="rounded-xl border border-border/80 bg-secondary/30 p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between font-semibold text-foreground">
              <span>{selectedUser?.fullName || selectedUser?.name}</span>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  selectedUser?.isActive
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                }`}>
                {selectedUser?.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-muted-foreground">
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="size-3.5 shrink-0" />
                <span className="truncate">{selectedUser?.email}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Phone className="size-3.5 shrink-0" />
                <span>{selectedUser?.mobileNumber || "No phone"}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Building2 className="size-3.5 shrink-0" />
                <span className="truncate">
                  {selectedUser?.businessName || "No business"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">
              Delivery Address <span className="text-destructive">*</span>
            </label>

            {addresses?.length === 0 ? (
              <div className="rounded-xl border border-dashed border-destructive/40 bg-destructive/5 p-4 text-center">
                <p className="text-xs font-semibold text-destructive">
                  This customer has no saved delivery addresses. Please add an
                  address to their account first.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <Select
                  value={selectedAddressId}
                  options={addressOptions}
                  placeholder="Select a saved delivery address..."
                  onChange={(e) => onSelectAddress(e.target.value)}
                  className="w-full"
                />

                {selectedAddressObj && formattedSelectedAddress && (
                  <div className="rounded-xl border border-border/80 bg-background p-3 flex items-start gap-2.5 text-xs text-muted-foreground">
                    <MapPin className="size-4 shrink-0 text-primary mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="font-semibold text-foreground">
                        {selectedAddressObj?.fullName || selectedUser?.fullName}
                        {selectedAddressObj?.phone && (
                          <span className="font-normal font-mono text-muted-foreground ml-1.5">
                            ({selectedAddressObj?.phone})
                          </span>
                        )}
                      </p>
                      <p className="leading-relaxed">
                        {formattedSelectedAddress}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
