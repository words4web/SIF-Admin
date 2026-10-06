export interface FormatDateOptions {
  includeTime?: boolean;
  includeSeconds?: boolean;
  fallback?: string;
  options?: Intl.DateTimeFormatOptions;
}

export function formatDate(
  dateValue: string | Date | number | null | undefined,
  options?: FormatDateOptions | Intl.DateTimeFormatOptions,
): string {
  if (!dateValue) {
    if (options && "fallback" in options && options.fallback !== undefined) {
      return options.fallback;
    }
    return "N/A";
  }

  const date =
    typeof dateValue === "string" || typeof dateValue === "number"
      ? new Date(dateValue)
      : dateValue;

  if (isNaN(date.getTime())) return "N/A";

  if (
    options &&
    !("includeTime" in options) &&
    !("fallback" in options) &&
    !("includeSeconds" in options) &&
    !("options" in options)
  ) {
    return date.toLocaleDateString(
      "en-GB",
      options as Intl.DateTimeFormatOptions,
    );
  }

  const opts = (options as FormatDateOptions) || {};
  const includeTime = opts.includeTime ?? false;
  const includeSeconds = opts.includeSeconds ?? false;

  const defaultFormatOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(includeTime
      ? {
          hour: "2-digit",
          minute: "2-digit",
          ...(includeSeconds ? { second: "2-digit" } : {}),
        }
      : {}),
    ...opts.options,
  };

  return date.toLocaleDateString("en-GB", defaultFormatOptions);
}

export function formatDateTime(
  dateValue: string | Date | number | null | undefined,
  includeSeconds = false,
): string {
  return formatDate(dateValue, { includeTime: true, includeSeconds });
}

export function formatAddress(
  address?: {
    streetAddress?: string;
    building?: string;
    city?: string;
    postalCode?: string;
  } | null,
): string {
  if (!address) return "";
  return [
    address?.streetAddress,
    address?.building,
    address?.city,
    address?.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
}

export function getAddressOptions(
  addresses: any[] = [],
  fallbackName?: string,
): { value: string; label: string }[] {
  return addresses.map((addr) => {
    const formatted = formatAddress(addr);
    const label = `${addr?.fullName || fallbackName || "Contact"} - ${formatted}`;
    return {
      value: addr?._id,
      label,
    };
  });
}
