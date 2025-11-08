"use client";
import { useCartStore } from "@/store/useCartStore";

export default function CartDrawer() {
    const items = useCartStore((s) => s.items);
    const remove = useCartStore((s) => s.removeItem);
    const clear = useCartStore((s) => s.clear);

    const total = items.reduce((s, i) => s + (i.price ?? 0) * i.qty, 0);

    return (
        <aside className="fixed right-4 top-16 w-80 p-4 bg-white border rounded shadow">
            <h4 className="font-semibold">Carrito</h4>
            <div className="mt-2 space-y-2">
                {items.length === 0 && <p className="text-sm text-gray-500">Carrito vacío</p>}
                {items.map((it, idx) => (
                    <div key={`${it.productId}-${it.size}-${idx}`} className="flex justify-between items-center">
                        <div>
                            <div className="text-sm font-medium">{it.productName}</div>
                            <div className="text-xs text-gray-500">{it.size} • {it.qty} uds</div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="text-sm">S/. {(it.price ?? 0) * it.qty}</div>
                            <button className="text-xs text-red-500" onClick={() => remove(it.productId, it.size)}>
                                Quitar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {items.length > 0 && (
                <>
                <div className="mt-3 border-t pt-2 text-right">
                    <div className="text-sm">Total: S/. {total.toFixed(2)}</div>
                    <div className="mt-2 flex justify-end gap-2">
                        <button onClick={() => clear()} className="px-3 py-1 bg-gray-200 rounded">Vaciar</button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded">Checkout</button>
                    </div>
                </div>
                </>
            )}
        </aside>
    );
}