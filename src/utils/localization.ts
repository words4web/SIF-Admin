import { LocalizedString } from "@/types/category/category.types";

export function cleanLocalizedString(
  val?: { en?: string | null; it?: string | null } | null,
): LocalizedString | null {
  if (!val) return null;
  const en = val.en?.trim() || "";
  const it = val.it?.trim() || "";
  if (!en && !it) return null;
  return { en, it };
}

export function getLocalizedDisplay(
  val?: LocalizedString | string | null,
  preferredLocale: "en" | "it" = "en",
  fallback = "",
): string {
  if (!val) return fallback;
  if (typeof val === "string") return val;
  const preferred = val[preferredLocale]?.trim();
  if (preferred) return preferred;
  const alternative =
    preferredLocale === "en" ? val.it?.trim() : val.en?.trim();
  return alternative || fallback;
}
