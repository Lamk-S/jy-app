"use client";
import QRScanner from "@/components/QRScanner";
import { useState } from "react";
import { useProductByQr } from "@/hooks/useProductQuery";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";

export default function Page() {
    const [qr, setQr] = useState<string | null>(null);
    const q = useProductByQr(qr);

    return (
        <div className="flex flex-col items-center gap-6">
            <h2 className="text-2xl font-bold">Escanear código QR</h2>

            {/* QRScanner: deberá llamar a setQr (mueve useScanHandler aquí si prefieres) */}
            <QRScanner />

            {/* Alternativa: campo manual para pruebas */}
            <div className="w-full max-w-md">
                <label className="block text-sm">Prueba manual (pega QR)</label>
                <input
                    type="text"
                    placeholder="POLERA-001"
                    onBlur={(e) => setQr(e.target.value.trim())}
                    className="w-full p-2 border rounded mt-1"
                />
            </div>

            {q.isLoading && <p>Cargando producto...</p>}
            {q.data && <ProductCard product={q.data} />}

            <CartDrawer />
        </div>
    );
}