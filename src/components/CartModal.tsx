"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";

export default function CartModal({ onClose }: { onClose: () => void }) {
  const { items, removeItem, clear, updateQty, getTotal } = useCartStore();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Calcula el total usando la función del store
  const total = getTotal();

  // Función para manejar cambios de cantidad con validación
  const handleQtyChange = (productId: number, size: string | null, newQty: number, stock: number) => {
    setError(null);
    setSuccess(null);
    if (newQty < 1) {
      setError("La cantidad debe ser al menos 1.");
      return;
    }
    if (newQty > stock) {
      setError(`Stock insuficiente. Solo hay ${stock} unidades disponibles.`);
      return;
    }
    updateQty(productId, size, newQty);
    setSuccess("Cantidad actualizada.");
  };

  // Limpia mensajes después de 3 segundos
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto relative">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Cerrar modal del carrito"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13l-1.1 5M7 13h10m0 0v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8" />
          </svg>
          Carrito de Compras
        </h2>

        {/* Mensajes de feedback */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg text-green-700 dark:text-green-300 text-sm flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {success}
          </div>
        )}

        {/* Lista de items */}
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13l-1.1 5M7 13h10m0 0v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8" />
            </svg>
            <p>El carrito está vacío</p>
          </div>
        ) : (
          <ul className="space-y-4 mb-6">
            {items.map((item) => (
              <li key={`${item.productId}-${item.size}`} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">{item.productName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Talla: {item.size || "N/A"} | Stock: {item.stock}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Precio: S/.{item.price?.toFixed(2) || "N/A"}</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Subtotal: S/.{(item.price ? item.price * item.qty : 0).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Controles de cantidad */}
                  <button
                    onClick={() => handleQtyChange(item.productId, item.size, item.qty - 1, item.stock)}
                    className="w-8 h-8 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors"
                    aria-label="Disminuir cantidad"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-8 text-center font-medium">{item.qty}</span>
                  <button
                    onClick={() => handleQtyChange(item.productId, item.size, item.qty + 1, item.stock)}
                    className="w-8 h-8 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  {/* Botón eliminar */}
                  <button
                    onClick={() => removeItem(item.productId, item.size)}
                    className="ml-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                    aria-label="Eliminar item"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Total y acciones */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-gray-800 dark:text-gray-200">Total:</span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">S/.{total.toFixed(2)}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={clear}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Vaciar Carrito
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}