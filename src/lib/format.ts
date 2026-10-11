const currency = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

export function formatPrice(value: number | null | undefined): string {
  if (value == null) return "N/A";
  return currency.format(value);
}

export const formatEuros = formatPrice;
export const formatPounds = formatPrice;

export function formatWeight(grams: number | null | undefined): string {
  if (grams == null || isNaN(grams) || grams <= 0) return "";
  if (grams >= 1000) {
    const kg = grams / 1000;
    return `${Number.isInteger(kg) ? kg : kg.toFixed(1)}kg`;
  }
  return `${grams}g`;
}

export function hueIndex(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash % 5;
}
