"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function CartButton({ onClick }: { onClick: () => void }) {
  const totalItems = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.qty, 0)
  );

  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Abrir carrito de compras"
    >
      <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
          {totalItems}
        </span>
      )}
    </button>
  );
}