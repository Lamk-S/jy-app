"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/useCartStore";

export default function CartModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-in-out data-closed:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-0 flex justify-center items-end lg:items-center">
            <DialogPanel
              transition
              className="pointer-events-auto w-full h-full lg:max-w-2xl lg:max-h-[70vh] lg:rounded-2xl transform transition duration-500 ease-in-out data-closed:translate-y-full lg:data-closed:scale-95 lg:data-closed:opacity-0 sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-hidden bg-white dark:bg-gray-800 shadow-2xl lg:rounded-2xl">
                {/* Header */}
                <div className="flex items-start justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-600 shrink-0">
                  <DialogTitle className="text-lg sm:text-xl font-medium text-gray-900 dark:text-gray-200 flex items-center gap-2">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13l-1.1 5M7 13h10m0 0v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8" />
                    </svg>
                    Carrito de Compras
                  </DialogTitle>
                  <button
                    type="button"
                    onClick={onClose}
                    className="relative -m-2 p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon aria-hidden="true" className="size-5 sm:size-6" />
                  </button>
                </div>

                {/* Mensajes de feedback */}
                {(error || success) && (
                  <div className="px-4 sm:px-6 pt-4 shrink-0">
                    {error && (
                      <div className="p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg text-green-700 dark:text-green-300 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {success}
                      </div>
                    )}
                  </div>
                )}

                {/* Lista de items */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
                  {items.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13l-1.1 5M7 13h10m0 0v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8" />
                      </svg>
                      <p className="text-sm sm:text-base">Your cart is empty</p>
                    </div>
                  ) : (
                    <ul role="list" className="space-y-3 sm:space-y-4">
                      {items.map((item) => (
                        <li key={`${item.productId}-${item.size}`} className="flex py-6">
                          <div className="size-20 sm:size-24 shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-600">
                            <img
                              alt={item.productName}
                              src={item.imageSrc || "/images/placeholder.png"}
                              className="size-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/images/placeholder.jpg";
                              }}
                            />
                          </div>

                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900 dark:text-gray-200">
                                <h3>
                                  <a href="#">{item.productName}</a>
                                </h3>
                                <p className="ml-4">S/.{item.price?.toFixed(2) || "N/A"}</p>
                              </div>
                              <div className="flex justify-between text-base font-medium text-gray-900 dark:text-gray-200">
                                <p className="mt-1 text-sm text-green-500 dark:text-green-400">Subtotal</p>
                                <p className="ml-4 text-green-500 dark:text-green-400">S/.{(item.price ? item.price * item.qty : 0).toFixed(2) || "N/A"}</p>
                              </div>         
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Talla: {item.size || "N/A"} | Stock: {item.stock}</p>                     
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <div className="flex items-center gap-2">
                                {/* Controles de cantidad */}
                                <button
                                  onClick={() => handleQtyChange(item.productId, item.size, item.qty - 1, item.stock)}
                                  className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors"
                                  aria-label="Disminuir cantidad"
                                >
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                  </svg>
                                </button>
                                <span className="w-6 sm:w-8 text-center font-medium text-sm sm:text-base">{item.qty}</span>
                                <button
                                  onClick={() => handleQtyChange(item.productId, item.size, item.qty + 1, item.stock)}
                                  className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors"
                                  aria-label="Aumentar cantidad"
                                >
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                </button>
                              </div>

                              <div className="flex">
                                <button
                                  onClick={() => removeItem(item.productId, item.size)}
                                  className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Total y acciones */}
                {items.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-600 px-4 sm:px-6 py-4 shrink-0">
                    <div className="flex justify-between text-base font-medium text-gray-900 dark:text-gray-200">
                      <p>Total</p>
                      <p>S/.{total.toFixed(2)}</p>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => {
                          clear();
                          onClose();
                        }}
                        className="flex items-center justify-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-red-700 w-full"
                      >
                        Vaciar Carrito
                      </button>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500 dark:text-gray-400">
                      <p>
                        o{' '}
                        <button
                          type="button"
                          onClick={onClose}
                          className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                        >
                          Continuar Comprando
                          <span aria-hidden="true"> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}