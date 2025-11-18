import { supabase } from "@/lib/supabaseClient";
import type { Product } from "@/types/product";

export async function fetchProductAndVariants(sku: string): Promise<Product | null> {
  // Traer producto
  const { data: prod, error: e1 } = await supabase
    .from("products")
    .select("id, sku, name, brand, price, total_stock, description")
    .eq("sku", sku)
    .maybeSingle();

  if (e1 || !prod) {
    if (e1) console.error(e1);
    return null;
  }

  // Traer stock por talla
  const { data: variants, error: e2 } = await supabase
    .from("size_stock")
    .select("id, quantity, sizes (code)")
    .eq("product_id", prod.id);

  if (e2) console.error(e2);

  const formattedVariants =
    variants?.map((v: any) => ({
      id: v.id,
      size: v.sizes?.code ?? "N/A",
      stock: v.quantity,
    })) ?? [];

  return {
    ...prod,
    variants: formattedVariants,
  };
}