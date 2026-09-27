-- ============================================
-- SCRIPT DE INICIALIZACIÓN - SPORTWEAR STORE
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. TABLA DE PRODUCTOS
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  team TEXT DEFAULT '',
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  image_url TEXT DEFAULT '',
  is_preorder BOOLEAN DEFAULT FALSE,
  delivery_days INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLA DE VARIANTES (JUGADORES/TALLAS/STOCK)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  sizes TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA DE ZONAS DE ENTREGA
CREATE TABLE IF NOT EXISTS delivery_zones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA DE CONFIGURACIÓN DEL NEGOCIO
CREATE TABLE IF NOT EXISTS business_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  business_name TEXT DEFAULT 'SportWear Store',
  whatsapp_number TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address TEXT DEFAULT '',
  description TEXT DEFAULT '',
  instagram TEXT DEFAULT '',
  facebook TEXT DEFAULT '',
  telegram TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLA DE PEDIDOS (historial)
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC NOT NULL DEFAULT 0,
  delivery_zone TEXT,
  delivery_price NUMERIC DEFAULT 0,
  address TEXT,
  pickup_time TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ÍNDICES PARA MEJORAR RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- 7. POLÍTICAS RLS (Row Level Security)
-- Activar RLS en todas las tablas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE LECTURA (públicas)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Product variants are viewable by everyone" ON product_variants
  FOR SELECT USING (true);

CREATE POLICY "Delivery zones are viewable by everyone" ON delivery_zones
  FOR SELECT USING (true);

CREATE POLICY "Business settings are viewable by everyone" ON business_settings
  FOR SELECT USING (true);

-- POLÍTICAS DE ESCRITURA (solo autenticados/admin)
CREATE POLICY "Products are insertable by authenticated users" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Products are updatable by authenticated users" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Products are deletable by authenticated users" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Variants are insertable by authenticated users" ON product_variants
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Variants are updatable by authenticated users" ON product_variants
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Variants are deletable by authenticated users" ON product_variants
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Zones are insertable by authenticated users" ON delivery_zones
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Zones are updatable by authenticated users" ON delivery_zones
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Zones are deletable by authenticated users" ON delivery_zones
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Settings are updatable by authenticated users" ON business_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Settings are insertable by authenticated users" ON business_settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Orders are insertable by everyone" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Orders are viewable by authenticated users" ON orders
  FOR SELECT USING (auth.role() = 'authenticated');

-- 8. INSERTAR DATOS INICIALES DE EJEMPLO
INSERT INTO business_settings (id, business_name, whatsapp_number, email, address, description)
VALUES ('main', 'SportWear Store', '5351234567', 'contacto@sportwear.com', 'La Habana, Cuba', 'Las mejores camisetas deportivas al mejor precio. Envíos a toda Cuba.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO delivery_zones (name, price) VALUES
  ('La Habana', 200),
  ('Provincias cercanas', 350),
  ('Resto del país', 500)
ON CONFLICT DO NOTHING;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
