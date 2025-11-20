"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProductList() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, sku, name, brand, price, description")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div className="h-48 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-600">Error al cargar productos. Inténtalo de nuevo.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products?.map((product) => (
        <Link key={product.id} href={`/producto/${product.sku}`} className="group">
          <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full min-h-[350px]">
            {/* Imagen */}
            <div className="relative h-56 md:h-64 bg-gray-100 shrink-0">
              <Image
                // Aqui para editar las imagenes del producto
                // src={`/images/${product.sku}/main.jpg`}
                src={`/images/main.jpg`}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = "/images/placeholder.jpg"; // Placeholder si no hay imagen
                }}
              />
            </div>
            
            {/* Detalles */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{product.brand || "Sin marca"}</p>
              <p className="text-xl font-bold text-green-600">S/.{product.price}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}