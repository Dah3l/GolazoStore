-- ============================================
-- MIGRACIÓN: Múltiples Imágenes por Producto
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. Crear tabla de imágenes de productos
CREATE TABLE IF NOT EXISTS product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Índice para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_order ON product_images(display_order);

-- 3. Políticas RLS
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Lectura pública
CREATE POLICY "Product images are viewable by everyone" ON product_images
  FOR SELECT USING (true);

-- Escritura solo para autenticados
CREATE POLICY "Product images are insertable by authenticated users" ON product_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Product images are updatable by authenticated users" ON product_images
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Product images are deletable by authenticated users" ON product_images
  FOR DELETE USING (auth.role() = 'authenticated');

-- 4. Migrar imagen existente a la nueva tabla (si existe)
INSERT INTO product_images (product_id, image_url, display_order)
SELECT id, image_url, 0
FROM products
WHERE image_url IS NOT NULL AND image_url != '';

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
-- NOTA: Después de ejecutar este script, el campo image_url en la tabla products
-- ya no se usará. Todas las imágenes se gestionarán desde product_images.
