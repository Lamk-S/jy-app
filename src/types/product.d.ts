export type Size = {
  id: number;
  code: string; // e.g., "S", "M", "L", "30"
  name?: string;
};

export type Color = {
  id: number;
  name: string; // e.g., "Rojo", "Azul"
};

export type ProductImage = {
  id: number;
  filename: string;
  alt_text?: string;
  is_primary: boolean;
  color_id?: number | null;
};

export type Variant = {
  id: number;
  color: Color;
  size: Size;
  stock: number;
};

export type Product = {
  id: number;
  sku: string;
  name: string;
  brand?: string | null;
  price?: number | null;
  description?: string | null;
  total_stock: number;
  colors?: Color[];
  images?: ProductImage[];
  variants?: Variant[];
};

export type ProductRow = {
  id: number;
  sku: string;
  name: string;
  brand?: string | null;
  price?: number | null;
  description?: string | null;
  total_stock: number;
  colors?: Color[];
  images?: ProductImage[];
  variants?: Variant[];
};