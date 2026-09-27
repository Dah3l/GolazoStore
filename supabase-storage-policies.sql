-- ============================================
-- POLÍTICAS DE STORAGE PARA IMÁGENES
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. Crear políticas para el bucket 'products'
-- Permitir lectura pública de imágenes
CREATE POLICY "Allow public read access on products bucket"
ON storage.objects
FOR SELECT
USING (bucket_id = 'products');

-- 2. Permitir subida de imágenes para usuarios autenticados
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
);

-- 3. Permitir actualización de imágenes para usuarios autenticados
CREATE POLICY "Allow authenticated users to update images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
);

-- 4. Permitir eliminación de imágenes para usuarios autenticados
CREATE POLICY "Allow authenticated users to delete images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
);

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
-- NOTA: Si ya ejecutaste supabase-init.sql, este script
-- es adicional para configurar las políticas de storage.
-- Si el bucket 'products' no existe, créalo primero en:
-- Supabase Dashboard → Storage → New bucket → Name: products → Public bucket: ON
