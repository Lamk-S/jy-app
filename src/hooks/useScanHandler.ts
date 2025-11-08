"use client";
import { useState } from "react";
import { useProductByQr } from "./useProductQuery";

export function useScanHandler() {
    const [lastQr, setLastQr] = useState<string | null>(null);
    const productQuery = useProductByQr(lastQr);

    const onDecoded = (text: string) => {
        const clean = text.trim();
        setLastQr(clean);
    };

    return {
        onDecoded,
        productQuery,
        lastQr,
    };
}