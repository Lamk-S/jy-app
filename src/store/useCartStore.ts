import { create } from "zustand";
import type { Product } from "@/types/product";

export type CartItem = {
    productId: string;
    productName: string;
    size: string | null;
    qty: number;
    price: number | null;
};

type CartState = {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    updateQty: (productId: string, size: string | null, qty: number) => void;
    removeItem: (productId: string, size: string | null) => void;
    clear: () => void;
};

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    addItem: (item) =>
        set((state) => {
        const key = (it: CartItem) => `${it.productId}::${it.size ?? ""}`;
        const existing = state.items.find((i) => key(i) === key(item));
        if (existing) {
            return {
            items: state.items.map((i) =>
                key(i) === key(item) ? { ...i, qty: i.qty + item.qty } : i
            ),
            };
        }
        return { items: [...state.items, item] };
        }),
    updateQty: (productId, size, qty) =>
        set((state) => ({
        items: state.items.map((i) =>
            i.productId === productId && i.size === size ? { ...i, qty } : i
        ),
        })),
    removeItem: (productId, size) =>
        set((state) => ({
        items: state.items.filter((i) => !(i.productId === productId && i.size === size)),
        })),
    clear: () => set({ items: [] }),
}));