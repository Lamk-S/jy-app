"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export default function ProductList() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*");
      return data;
    },
  });

  if (isLoading) return <p>Cargando productos...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products?.map((product) => (
        <div key={product.id} className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-bold">{product.name}</h3>
          <p>Precio: ${product.price}</p>
          {/* Agrega imagen, descripción, etc. */}
        </div>
      ))}
    </div>
  );
}