"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import type { Product, Variant } from "@/types/product";

interface ProductScanModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductScanModal({ product, onClose }: ProductScanModalProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const selectedVariant: Variant | undefined = product.variants?.find(
    (v) => v.size === selectedSize
  );

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setQty(1);
    setError(null);
  };

  const handleQtyChange = (delta: number) => {
    if (!selectedVariant) return;
    const newQty = qty + delta;
    if (newQty >= 1 && newQty <= selectedVariant.stock) {
      setQty(newQty);
      setError(null);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError("Por favor seleccione una talla.");
      return;
    }

    const stock = selectedVariant?.stock ?? 0;

    if (qty > stock) {
      setError(`⚠️ Stock insuficiente. Solo hay ${stock} unidades disponibles.`);
      return;
    }

    addItem({
      productId: product.id,
      productName: product.name,
      size: selectedSize,
      qty,
      price: product.price ?? 0,
      stock,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Header con gradiente */}
        <div className="bg-gray-700 dark:bg-gray-900 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 dark:hover:text-gray-400 transition"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold mb-1">{product.name}</h2>
          {product.brand && (
            <p className="text-blue-100 dark:text-blue-300 text-sm">Marca: {product.brand}</p>
          )}
        </div>

        <div className="p-6">
          {/* Detalles del producto */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-600 dark:text-gray-400 text-sm">SKU: <span className="font-medium">{product.sku}</span></p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">S/. {product.price?.toFixed(2) || "N/A"}</p>
            </div>
            {product.description && (
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{product.description}</p>
            )}
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">Stock total: {product.total_stock} unidades</p>
          </div>

          {/* Selección de tallas */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-200">Selecciona una talla</h3>
            <div className="grid grid-cols-4 gap-3">
              {product.variants?.length ? (
                product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleSizeSelect(v.size)}
                    disabled={v.stock === 0}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedSize === v.size
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105"
                        : v.stock === 0
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600 cursor-not-allowed"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:shadow-md"
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-bold text-lg">{v.size}</div>
                      <div className="text-xs mt-1">{v.stock} disp.</div>
                    </div>
                    {v.stock === 0 && (
                      <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                        <span className="text-red-600 dark:text-red-400 font-bold text-xs">AGOTADO</span>
                      </div>
                    )}
                  </button>
                ))
              ) : (
                <p className="col-span-4 text-gray-500 dark:text-gray-400 text-center py-4">No hay tallas disponibles.</p>
              )}
            </div>
          </div>

          {/* Cantidad */}
          {selectedVariant && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-200">Cantidad</h3>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => handleQtyChange(-1)}
                  disabled={qty <= 1}
                  className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-2xl font-bold w-16 text-center">{qty}</span>
                <button
                  onClick={() => handleQtyChange(1)}
                  disabled={qty >= selectedVariant.stock}
                  className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                Máximo: {selectedVariant.stock} unidades
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Botón agregar */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize || qty > (selectedVariant?.stock || 0)}
            className="w-full bg-linear-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
          >
            <ShoppingCart className="w-5 h-5" />
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}