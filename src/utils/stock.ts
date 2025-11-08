import type { Variant } from "@/types/product";

export function calcTotalStock(variants: Variant[] = []) {
  return variants.reduce((s, v) => s + (v.stock || 0), 0);
}