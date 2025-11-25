"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import type { Product, Color, ProductImage, Variant } from "@/types/product";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProductList() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      // Query actualizada con joins para colores, imágenes y stock
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_colors(colors(*)),
          product_images(*),
          product_stock(id, quantity, colors(*), sizes(*))
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Mapear datos a tipos Product
      return data?.map((item: any) => {
        const colors: Color[] = item.product_colors?.map((pc: any) => pc.colors) || [];
        const images: ProductImage[] = item.product_images?.map((img: any) => ({
          id: img.id,
          filename: img.filename,
          alt_text: img.alt_text,
          is_primary: img.is_primary,
          color_id: img.color_id,
        })) || [];
        const variants: Variant[] = item.product_stock?.map((ps: any) => ({
          id: ps.id,
          color: ps.colors,
          size: ps.sizes,
          stock: ps.quantity,
        })) || [];
        const total_stock = variants.reduce((sum, v) => sum + v.stock, 0); // Calcular stock total

        return {
          ...item,
          colors,
          images,
          variants,
          total_stock, // Sobrescribir con cálculo real
        } as Product;
      }) || [];
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-pulse">
            <div className="h-48 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-600 dark:text-red-400">Error al cargar productos. Inténtalo de nuevo.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products?.map((product) => {
        // Obtener imagen primaria o primera disponible
        const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];
        const imageSrc = primaryImage ? `/images/${primaryImage.filename}` : "/images/placeholder.jpg";

        return (
          <Link key={product.id} href={`/producto/${product.sku}`} className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full min-h-[350px]">
              {/* Imagen */}
              <div className="relative h-56 md:h-64 bg-gray-100 dark:bg-gray-700 shrink-0">
                <Image
                  src={imageSrc}
                  alt={primaryImage?.alt_text || product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = "/images/placeholder.jpg"; // Placeholder si no hay imagen
                  }}
                />
              </div>

              {/* Detalles */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.brand || "Sin marca"}</p>

                {/* Colores disponibles */}
                {product.colors && product.colors.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {product.colors.slice(0, 4).map((color) => (
                      <span
                        key={color.id}
                        className="inline-block w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.name.toLowerCase() }} // Simplificado; usa clases si configuras Tailwind
                        title={color.name}
                      ></span>
                    ))}
                    {product.colors.length > 4 && <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>}
                  </div>
                )}

                <div className="mt-auto">
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">S/.{product.price}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Stock: {product.total_stock} {product.total_stock === 0 && <span className="text-red-500">(Agotado)</span>}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}