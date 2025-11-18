"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useUiStore } from "@/store/useUIStore";
import CartModal from "./CartModal";

export default function CartButton() {
  const totalItems = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.qty, 0)
  );
  const { isCartOpen, openCart, closeCart } = useUiStore();

  return (
    <>
      <button
        onClick={openCart}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition"
      >
        <ShoppingCart className="w-6 h-6" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
            {totalItems}
          </span>
        )}
      </button>

      {isCartOpen && <CartModal onClose={closeCart} />}
    </>
  );
}