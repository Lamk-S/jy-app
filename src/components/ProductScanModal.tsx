"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { X, Plus, Minus, ShoppingCart, AlertCircle } from "lucide-react";
import type { Product, Variant } from "@/types/product";
import Image from "next/image";

interface ProductScanModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductScanModal({ product, onClose }: ProductScanModalProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const selectedVariant: Variant | undefined = product.variants?.find(
    (v) => v.size === selectedSize
  );

  // Colores simulados (reemplaza con datos reales)
  const colors = [
    { id: 'white', name: 'Blanco', classes: 'bg-white border-gray-300' },
    { id: 'gray', name: 'Gris', classes: 'bg-gray-400 border-gray-400' },
    { id: 'black', name: 'Negro', classes: 'bg-black border-black' },
  ];

  // Imágenes simuladas (reemplaza con product.images)
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

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setError("Por favor seleccione una talla.");
      return;
    }

    const stock = selectedVariant?.stock ?? 0;
    if (qty > stock) {
      setError(`⚠️ Stock insuficiente. Solo hay ${stock} unidades disponibles.`);
      return;
    }

    setIsAdding(true);
    setTimeout(() => {
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
      setIsAdding(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/70 dark:bg-black/90 backdrop-blur-md flex justify-center items-center z-50 p-4">
      <div className="w-full max-w-7xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-y-auto lg:overflow-hidden transform transition-all duration-300 ease-out">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-white/80 dark:bg-gray-800/80 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Cerrar modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Layout principal */}
        <div className="flex flex-col lg:flex-row overflow-visible">
          {/* Columna izquierda: Imagen y thumbnails */}
          <div className="lg:w-1/3 flex flex-col lg:flex-row">
            {/* Imagen principal */}
            <div className="relative w-full h-72 sm:h-96 lg:h-full lg:flex-1 bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
              <Image
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                fill
                className="object-contain p-6 lg:p-8"
                priority
              />
            </div>

            {/* Thumbnails: En móvil apilados, en PC en columna vertical o 2 columnas */}
            <div className="flex lg:flex-col gap-3 p-4 lg:w-26 lg:justify-start lg:overflow-y-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`shrink-0 rounded-xl border-2 transition-all duration-200 ${
                    selectedImage === index
                      ? 'border-indigo-600 shadow-lg scale-105'
                      : 'border-gray-300 hover:border-indigo-400 hover:shadow-md'
                  } ${images.length > 4 ? 'lg:grid lg:grid-cols-2 lg:gap-2' : ''} w-16 h-16`}
                  aria-label={`Ver imagen ${index + 1}`}
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

          {/* Columna centro: Detalles del producto */}
          <div className="lg:w-1/3 p-6 lg:p-10 flex flex-col space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
                {product.name}
              </h1>
              {product.brand && (
                <p className="text-xl text-indigo-600 dark:text-indigo-400 font-semibold mt-2">
                  {product.brand}
                </p>
              )}
            </div>

            <div>
              <p className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-3">
                {product.price ? `S/. ${product.price.toFixed(2)}` : "Precio no disponible"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                SKU: <span className="font-semibold">{product.sku}</span> | Stock total: <span className="font-semibold">{product.total_stock}</span> unidades
              </p>
            </div>

            {product.description && (
              <div>
                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>

          {/* Columna derecha: Opciones */}
          <div className="lg:w-1/3 p-6 lg:p-10 space-y-8">
            {/* Colores */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Color</h3>
              <fieldset aria-label="Elige un color" className="flex items-center gap-4">
                {colors.map((color) => (
                  <label key={color.id} className="relative cursor-pointer group">
                    <input
                      type="radio"
                      name="color"
                      value={color.id}
                      checked={selectedColor === color.id}
                      onChange={() => handleColorSelect(color.id)}
                      className="sr-only"
                    />
                    <span
                      className={`block w-12 h-12 rounded-full border-2 transition-all duration-200 group-hover:scale-110 ${
                        selectedColor === color.id
                          ? 'border-indigo-600 scale-110 shadow-lg'
                          : 'border-gray-300 hover:border-indigo-400'
                      } ${color.classes}`}
                      title={color.name}
                    ></span>
                  </label>
                ))}
              </fieldset>
            </div>

            {/* Tallas */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Talla</h3>
                <a
                  href="#"
                  className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline"
                >
                  Guía de tallas
                </a>
              </div>
              <fieldset aria-label="Elige una talla" className="grid grid-cols-4 gap-4">
                {product.variants?.length ? (
                  product.variants.map((v) => (
                    <label
                      key={v.id}
                      className={`group relative flex items-center justify-center rounded-xl border-2 p-4 cursor-pointer transition-all duration-200 ${
                        selectedSize === v.size
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-lg scale-105'
                          : v.stock === 0
                          ? 'border-gray-300 bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed opacity-60'
                          : 'border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:border-indigo-400 hover:shadow-md hover:scale-105'
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
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          Agotado
                        </span>
                      )}
                    </label>
                  ))
                ) : (
                  <p className="col-span-4 text-gray-500 dark:text-gray-400 text-center py-6 text-lg">
                    No hay tallas disponibles.
                  </p>
                )}
              </fieldset>
            </div>

            {/* Cantidad */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Cantidad</h3>
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => handleQtyChange(-1)}
                  disabled={qty <= 1 || !selectedVariant}
                  className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-6 h-6" />
                </button>
                <span className="text-4xl font-black w-20 text-center text-gray-900 dark:text-white">
                  {selectedVariant ? qty : 0}
                </span>
                <button
                  onClick={() => handleQtyChange(1)}
                  disabled={!selectedVariant || qty >= (selectedVariant?.stock || 0)}
                  className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
              {selectedVariant && (
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                  Máximo: <span className="font-semibold">{selectedVariant.stock}</span> unidades
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-300">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Botón agregar */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || qty > (selectedVariant?.stock || 0) || isAdding}
              className="w-full bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-5 rounded-xl font-bold text-lg disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {isAdding ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Agregando...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-6 h-6" />
                  Agregar al carrito
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}