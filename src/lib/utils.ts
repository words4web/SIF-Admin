import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toSlug(value: string): string {
  if (!value) return "";
  return value
    ?.toLowerCase()
    ?.trim()
    ?.replace(/[^a-z0-9]+/g, "-")
    ?.replace(/(^-|-$)+/g, "");
}
