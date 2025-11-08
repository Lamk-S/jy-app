"use client";
import type { Product } from "@/types/product";
import SizeSelector from "./SizeSelector";
import { useCartStore } from "@/store/useCartStore";

export default function ProductCard({ product }: { product: Product }) {
    const add = useCartStore((s) => s.addItem);

    return (
        <div className="p-4 border rounded bg-white w-full max-w-md">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600">Marca: {product.brand ?? "-"}</p>
        <p className="text-sm text-gray-800 mt-2">Precio: S/. {product.price ?? 0}</p>
        <p className="text-sm text-gray-600">Stock total: {product.total_stock}</p>

        <div className="mt-4">
            <SizeSelector
            variants={product.variants ?? []}
            onAdd={(size, qty) =>
                add({
                productId: product.id,
                productName: product.name,
                size,
                qty,
                price: product.price ?? 0,
                })
            }
            />
        </div>
        </div>
    );
}