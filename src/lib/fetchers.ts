import { supabase } from "@/lib/supabaseClient";
import type { Product } from "@/types/product";

/**
 * Busca producto por SKU (escaneado del QR)
 */
export async function fetchProductAndVariants(sku: string): Promise<Product | null> {
  const { data: prod, error: e1 } = await supabase
    .from("products")
    .select("id, name, brand, price, total_stock, description, sku")
    .eq("sku", sku)
    .maybeSingle();

  if (e1 || !prod) {
    if (e1) console.error(e1);
    return null;
  }

  const { data: variants, error: e2 } = await supabase
    .from("size_stock")
    .select("id, quantity, size_id")
    .eq("product_id", prod.id);

  if (e2) console.error(e2);

  // Opcional: Se podría mapear `size_id` → talla real consultando la tabla sizes
  const mappedVariants = variants?.map((v) => ({
    id: v.id,
    size: v.size_id.toString(), // temporal
    stock: v.quantity,
  }));

  return {
    ...prod,
    variants: mappedVariants ?? [],
  };
}