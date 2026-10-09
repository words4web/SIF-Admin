export enum EProductUnit {
  CASE = "case",
  UNIT = "unit",
  EACH = "each",
}

export enum EStockStatus {
  IN_STOCK = "IN_STOCK",
  OUT_OF_STOCK = "OUT_OF_STOCK",
}

export const STOCK_STATUS_OPTIONS = [
  { value: EStockStatus.IN_STOCK, label: "In Stock" },
  { value: EStockStatus.OUT_OF_STOCK, label: "Out of Stock" },
];
