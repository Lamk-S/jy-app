"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchProductAndVariants } from "@/lib/fetchers";
import type { Product } from "@/types/product";

export function useProductByQr(qr: string | null) {
    return useQuery<Product | null>({
        queryKey: ["product", qr],
        queryFn: async () => {
        if (!qr) return null;
        return await fetchProductAndVariants(qr);
        },
        enabled: !!qr,
        staleTime: 1000 * 60 * 2,
    });
}