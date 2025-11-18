"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProductAndVariants } from "@/lib/fetchers";
import type { Product } from "@/types/product";

export function useProductByQr(sku: string | null) {
  return useQuery<Product | null>({
    queryKey: ["product", sku],
    queryFn: async () => {
      if (!sku) return null;
      return await fetchProductAndVariants(sku);
    },
    enabled: !!sku,
  });
}