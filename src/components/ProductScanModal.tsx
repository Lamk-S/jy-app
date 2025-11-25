"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import type { Product, Variant } from "@/types/product";
import Image from "next/image";

interface ProductScanModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductScanModal({ product, onClose }: ProductScanModalProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null); // Preparado para colores futuros
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0); // Para cambio de imágenes
  const [error, setError] = useState<string | null>(null);

  const selectedVariant: Variant | undefined = product.variants?.find(
    (v) => v.size === selectedSize
  );

  // Simulación de colores (preparado para futuro)
  const colors = [
    { id: 'white', name: 'Blanco', classes: 'bg-white border-gray-300' },
    { id: 'gray', name: 'Gris', classes: 'bg-gray-400 border-gray-400' },
    { id: 'black', name: 'Negro', classes: 'bg-black border-black' },
  ];

  // Simulación de imágenes (usando placeholder, preparado para múltiples)
  const images = [
    { src: '/images/placeholder.png', alt: `${product.name} vista principal` },
    { src: '/images/placeholder.png', alt: `${product.name} vista secundaria` },
    { src: '/images/placeholder.png', alt: `${product.name} vista terciaria` },
  ];

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setQty(1);
    setError(null);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
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
      sku: product.sku,
      size: selectedSize,
      qty,
      price: product.price ?? 0,
      stock,
      imageSrc: images[selectedImage].src,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-0 flex justify-center items-center lg:justify-center lg:items-center">
            <div className="pointer-events-auto w-full h-full lg:max-w-4xl lg:max-h-[90vh] lg:rounded-2xl transform transition duration-500 ease-in-out data-closed:translate-y-full sm:duration-700 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
              {/* Botón cerrar en esquina superior derecha */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Contenedor con scroll */}
              <div className="flex flex-col h-full overflow-y-auto">
                {/* Imagen principal (más grande en móviles) */}
                <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-gray-100 dark:bg-gray-800 shrink-0">
                  <Image
                    src={images[selectedImage].src}
                    alt={images[selectedImage].alt}
                    fill
                    className="object-contain"
                  />
                  {/* Thumbnails superpuestos en móviles */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 lg:hidden">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 ${
                          selectedImage === index ? 'border-indigo-600' : 'border-white/50'
                        }`}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detalles del producto */}
                <div className="flex-1 p-6 lg:p-8">
                  {/* Nombre y marca */}
                  <div className="mb-4">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
                    {product.brand && (
                      <p className="text-lg text-indigo-600 dark:text-indigo-400 font-medium">{product.brand}</p>
                    )}
                  </div>

                  {/* Precio y SKU */}
                  <div className="mb-6">
                    <p className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                      {product.price ? `S/. ${product.price.toFixed(2)}` : "Precio no disponible"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      SKU: <span className="font-medium">{product.sku}</span> | Stock total: <span className="font-medium">{product.total_stock}</span> unidades
                    </p>
                  </div>

                  {/* Descripción */}
                  {product.description && (
                    <div className="mb-6">
                      <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
                    </div>
                  )}

                  {/* Colores */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Color</h3>
                    <fieldset aria-label="Elige un color" className="flex items-center gap-x-4">
                      {colors.map((color) => (
                        <label key={color.id} className="relative cursor-pointer">
                          <input
                            type="radio"
                            name="color"
                            value={color.id}
                            checked={selectedColor === color.id}
                            onChange={() => handleColorSelect(color.id)}
                            className="sr-only"
                          />
                          <span
                            className={`block w-10 h-10 rounded-full border-2 transition-all ${
                              selectedColor === color.id ? 'border-indigo-600 scale-110' : 'border-gray-300'
                            } ${color.classes}`}
                          ></span>
                        </label>
                      ))}
                    </fieldset>
                  </div>

                  {/* Tallas */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Talla</h3>
                      <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        Guía de tallas
                      </a>
                    </div>
                    <fieldset aria-label="Elige una talla" className="grid grid-cols-4 gap-3">
                      {product.variants?.length ? (
                        product.variants.map((v) => (
                          <label
                            key={v.id}
                            className={`group relative flex items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all ${
                              selectedSize === v.size
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                : v.stock === 0
                                ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:border-indigo-400 hover:shadow-md'
                            }`}
                          >
                            <input
                              type="radio"
                              name="size"
                              value={v.size}
                              checked={selectedSize === v.size}
                              onChange={() => handleSizeSelect(v.size)}
                              disabled={v.stock === 0}
                              className="sr-only"
                            />
                            <span className="text-lg font-bold uppercase">{v.size}</span>
                            {v.stock === 0 && (
                              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">Agotado</span>
                            )}
                          </label>
                        ))
                      ) : (
                        <p className="col-span-4 text-gray-500 dark:text-gray-400 text-center py-4">No hay tallas disponibles.</p>
                      )}
                    </fieldset>
                  </div>

                  {/* Cantidad */}
                  {selectedVariant && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cantidad</h3>
                      <div className="flex items-center justify-center gap-6">
                        <button
                          onClick={() => handleQtyChange(-1)}
                          disabled={qty <= 1}
                          className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-6 h-6" />
                        </button>
                        <span className="text-3xl font-bold w-16 text-center text-gray-900 dark:text-white">{qty}</span>
                        <button
                          onClick={() => handleQtyChange(1)}
                          disabled={qty >= selectedVariant.stock}
                          className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>
                      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-3">
                        Máximo: <span className="font-medium">{selectedVariant.stock}</span> unidades
                      </p>
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm text-center">
                      {error}
                    </div>
                  )}

                  {/* Botón agregar */}
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedSize || qty > (selectedVariant?.stock || 0)}
                    className="w-full bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-lg font-bold text-lg disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    Agregar al carrito
                  </button>
                </div>

                {/* Thumbnails en PC (abajo de la imagen) */}
                <div className="hidden lg:flex justify-center gap-4 p-6 bg-gray-50 dark:bg-gray-800">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-indigo-600' : 'border-gray-300'
                      }`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}