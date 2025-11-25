-- CATEGORÍAS: tipo de prenda
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- GRUPOS DE DESTINO: hombre, mujer, niño, niña
CREATE TABLE target_groups (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- TALLAS
CREATE TABLE sizes (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE
);

-- RELACIÓN categoría ↔ tallas válidas
CREATE TABLE category_sizes (
  category_id INT REFERENCES categories(id) ON DELETE CASCADE,
  size_id INT REFERENCES sizes(id) ON DELETE CASCADE,
  PRIMARY KEY (category_id, size_id)
);

-- PRODUCTOS
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  brand TEXT,
  category_id INT REFERENCES categories(id),
  target_group_id INT REFERENCES target_groups(id),
  price NUMERIC(10,2) NOT NULL,
  total_stock INT NOT NULL DEFAULT 0, -- se actualizará automáticamente
  created_at TIMESTAMP DEFAULT now()
);

-- STOCK POR TALLA
CREATE TABLE size_stock (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  size_id INT REFERENCES sizes(id),
  quantity INT NOT NULL DEFAULT 0,
  UNIQUE (product_id, size_id)
);

CREATE TRIGGER trg_size_stock_insert
AFTER INSERT ON size_stock
FOR EACH ROW
EXECUTE FUNCTION update_total_stock();

CREATE TRIGGER trg_size_stock_update
AFTER UPDATE ON size_stock
FOR EACH ROW
EXECUTE FUNCTION update_total_stock();

CREATE TRIGGER trg_size_stock_delete
AFTER DELETE ON size_stock
FOR EACH ROW
EXECUTE FUNCTION update_total_stock();

CREATE OR REPLACE FUNCTION update_total_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET total_stock = (
    SELECT COALESCE(SUM(quantity), 0)
    FROM size_stock
    WHERE product_id = NEW.product_id
  )
  WHERE id = NEW.product_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;