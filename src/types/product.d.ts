export type Size = {
  code: string;
};

export type Variant = {
  id: number;
  size: string; // código visible ("S", "M", "L", "30", etc.)
  stock: number;
};

// Tipo que usa el frontend, incluye variants
export type Product = {
  id: number;
  sku: string;
  name: string;
  brand?: string | null;
  price?: number | null;
  description?: string | null;
  total_stock: number;
  variants?: Variant[];
};

// Tipo que refleja exactamente la tabla en Supabase
export type ProductRow = {
  id: number;
  sku: string;
  name: string;
  brand?: string | null;
  price?: number | null;
  description?: string | null;
  total_stock: number;
};