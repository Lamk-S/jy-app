export type Variant = {
  id: number | null;
  size: string;
  stock: number;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  brand?: string | null;
  price?: number | null;
  description?: string | null;
  total_stock: number;
  variants?: Variant[];
};