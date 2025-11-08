"use client";
import { useState } from "react";
import type { Variant } from "@/types/product";

export default function SizeSelector({
    variants,
    onAdd,
}: {
    variants: Variant[];
    onAdd: (size: string, qty: number) => void;
}) {
    const [selected, setSelected] = useState<string | null>(variants[0]?.size ?? null);
    const [qty, setQty] = useState<number>(1);

    const currentStock = variants.find((v) => v.size === selected)?.stock ?? 0;

    return (
        <div>
            <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                    <button
                        key={v.size}
                        className={`px-3 py-1 rounded border ${
                        selected === v.size ? "bg-sky-600 text-white" : "bg-white"
                        }`}
                        onClick={() => {
                        setSelected(v.size);
                        setQty(1);
                        }}
                    >
                        {v.size} ({v.stock})
                    </button>
                ))}
            </div>

            <div className="mt-3 flex items-center gap-2">
                <input
                    type="number"
                    min={1}
                    max={currentStock}
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, Math.min(currentStock, Number(e.target.value) || 1)))}
                    className="w-20 p-1 border rounded"
                />
                <button
                    disabled={!selected || currentStock === 0}
                    onClick={() => {
                        if (!selected) return;
                        onAdd(selected, qty);
                    }}
                    className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
                    >
                    Agregar ({currentStock} disp.)
                </button>
            </div>
        </div>
    );
}