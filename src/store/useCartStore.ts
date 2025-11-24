// src/store/useCartStore.ts
import { create } from "zustand";

export type CartItem = {
  productId: number;
  productName: string;
  sku: string; // Agregado para generar la URL de la imagen
  size: string | null;
  qty: number;
  price: number | null;
  stock: number;
  imageSrc?: string; // Agregado para la imagen del producto
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQty: (productId: number, size: string | null, qty: number) => void;
  removeItem: (productId: number, size: string | null) => void;
  clear: () => void;
  getTotal: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      const key = (i: CartItem) => `${i.productId}-${i.size ?? ""}`;
      const existing = state.items.find((i) => key(i) === key(item));

      if (existing) {
        const newQty = existing.qty + item.qty;
        if (newQty > existing.stock) {
          console.warn(`⚠️ Stock insuficiente. Solo hay ${existing.stock} unidades.`);
          return state;
        }
        return {
          items: state.items.map((i) =>
            key(i) === key(item) ? { ...i, qty: newQty } : i
          ),
        };
      }

      if (item.qty > item.stock) {
        console.warn(`⚠️ Stock insuficiente. Solo hay ${item.stock} unidades.`);
        return state;
      }

      return { items: [...state.items, item] };
    }),

  updateQty: (productId, size, qty) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId && i.size === size
          ? { ...i, qty: Math.min(qty, i.stock) }
          : i
      ),
    })),

  removeItem: (productId, size) =>
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.productId === productId && i.size === size)
      ),
    })),

  clear: () => set({ items: [] }),

  getTotal: () => {
    const state = get();
    return state.items.reduce((total, item) => total + (item.price ? item.price * item.qty : 0), 0);
  },
}));