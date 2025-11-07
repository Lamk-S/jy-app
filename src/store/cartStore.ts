import { create } from "zustand"

interface CartItem {
    id: string
    name: string
    size: string
    quantity: number
}

interface CartState {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (id: string) => void
    clear: () => void
}

export const useCartStore = create<CartState>((set) => ({
    items: [],
    addItem: (item) => set((state) => ({ items: [...state.items, item] })),
    removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
    clear: () => set({ items: [] }),
}))