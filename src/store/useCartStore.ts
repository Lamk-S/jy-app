import { create } from "zustand";
import type { Color, Size } from "@/types/product";

export type CartItem = {
  productId: number;
  productName: string;
  sku: string;
  color: Color;
  size: Size;
  qty: number;
  price: number | null;
  stock: number;
  imageSrc?: string;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQty: (productId: number, colorId: number, sizeId: number, qty: number) => void;
  removeItem: (productId: number, colorId: number, sizeId: number) => void;
  clear: () => void;
  getTotal: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      // Clave única: productId + colorId + sizeId
      const key = (i: CartItem) => `${i.productId}-${i.color.id}-${i.size.id}`;
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

  // updateQty usa IDs de color y size
  updateQty: (productId, colorId, sizeId, qty) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId && i.color.id === colorId && i.size.id === sizeId
          ? { ...i, qty: Math.min(qty, i.stock) }
          : i
      ),
    })),

  // removeItem usa IDs de color y size
  removeItem: (productId, colorId, sizeId) =>
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.productId === productId && i.color.id === colorId && i.size.id === sizeId)
      ),
    })),

  clear: () => set({ items: [] }),

  getTotal: () => {
    const state = get();
    return state.items.reduce((total, item) => total + (item.price ? item.price * item.qty : 0), 0);
  },
}));