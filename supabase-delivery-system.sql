-- ============================================
-- NUEVO SISTEMA DE ENTREGAS
-- Estructura: Localidades -> Lugares (puntos de entrega)
-- ============================================

-- 1. Crear tabla de localidades (zonas principales)
CREATE TABLE IF NOT EXISTS delivery_areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Crear tabla de lugares (puntos de entrega dentro de cada localidad)
CREATE TABLE IF NOT EXISTS delivery_places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  area_id UUID REFERENCES delivery_areas(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  precio INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_delivery_places_area_id ON delivery_places(area_id);

-- 4. Políticas RLS
ALTER TABLE delivery_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_places ENABLE ROW LEVEL SECURITY;

-- Lectura pública
CREATE POLICY "Delivery areas are viewable by everyone" ON delivery_areas
  FOR SELECT USING (true);

CREATE POLICY "Delivery places are viewable by everyone" ON delivery_places
  FOR SELECT USING (true);

-- Escritura solo para autenticados
CREATE POLICY "Delivery areas are manageable by authenticated users" ON delivery_areas
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Delivery places are manageable by authenticated users" ON delivery_places
  FOR ALL USING (auth.role() = 'authenticated');

-- 5. Insertar datos iniciales desde el JSON proporcionado
INSERT INTO delivery_areas (nombre) VALUES
  ('Alamar'),
  ('Arroyo Naranjo'),
  ('Bahia'),
  ('Boca Ciega'),
  ('Boyeros'),
  ('Camilo Cienfuegos'),
  ('Campo Florido'),
  ('Centro Habana'),
  ('Cerro'),
  ('Cojimar'),
  ('Cotorro'),
  ('Guanabacoa'),
  ('Guanabo'),
  ('Habana Vieja'),
  ('La Lisa'),
  ('Lawton'),
  ('Luyano'),
  ('Marianao'),
  ('N Vedado'),
  ('Playa'),
  ('Plaza'),
  ('Regla'),
  ('Reparto Eléctrico'),
  ('San Miguel del Padrón'),
  ('Vedado'),
  ('Víbora');

-- Nota: Los lugares se insertarán desde el panel de administración
-- o puedes ejecutar un script adicional con los lugares específicos

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
