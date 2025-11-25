"use client";
import { useState } from "react";
import type { Variant, Color, Size } from "@/types/product";


export default function VariantSelector({
  variants,
  onAdd,
}: {
  variants: Variant[]; // Array de variantes disponibles
  onAdd: (color: Color, size: Size, qty: number) => void;
}) {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [qty, setQty] = useState<number>(1);

  // Filtra tallas disponibles para el color seleccionado
  const availableSizes = selectedColor
    ? variants.filter((v) => v.color.id === selectedColor.id).map((v) => v.size)
    : [];

  // Stock para la variante seleccionada
  const currentVariant = variants.find(
    (v) => v.color.id === selectedColor?.id && v.size.id === selectedSize?.id
  );
  const currentStock = currentVariant?.stock ?? 0;

  return (
    <div>
      {/* Selector de Color */}
      <div className="mb-3">
        <label className="block text-sm font-medium">Color:</label>
        <div className="flex flex-wrap gap-2">
          {[...new Set(variants.map((v) => v.color))].map((color) => (
            <button
              key={color.id}
              className={`px-3 py-1 rounded border ${
                selectedColor?.id === color.id ? "bg-sky-600 text-white" : "bg-white"
              }`}
              onClick={() => {
                setSelectedColor(color);
                setSelectedSize(null); // Resetea talla al cambiar color
                setQty(1);
              }}
            >
              {color.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selector de Talla (habilitado solo si hay color seleccionado) */}
      {selectedColor && (
        <div className="mb-3">
          <label className="block text-sm font-medium">Talla:</label>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size.id}
                className={`px-3 py-1 rounded border ${
                  selectedSize?.id === size.id ? "bg-sky-600 text-white" : "bg-white"
                }`}
                onClick={() => {
                  setSelectedSize(size);
                  setQty(1);
                }}
              >
                {size.code} ({variants.find((v) => v.color.id === selectedColor.id && v.size.id === size.id)?.stock ?? 0})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selector de Cantidad y Botón Agregar */}
      {selectedColor && selectedSize && (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={currentStock}
            value={qty}
            onChange={(e) =>
              setQty(Math.max(1, Math.min(currentStock, Number(e.target.value) || 1)))
            }
            className="w-20 p-1 border rounded"
          />
          <button
            disabled={currentStock === 0}
            onClick={() => {
              if (!selectedColor || !selectedSize) return;
              onAdd(selectedColor, selectedSize, qty);
            }}
            className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
          >
            Agregar ({currentStock} disp.)
          </button>
        </div>
      )}
    </div>
  );
}