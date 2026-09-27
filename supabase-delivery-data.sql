-- ============================================
-- DATOS INICIALES: LOCALIDADES Y PUNTOS DE ENTREGA
-- Ejecutar DESPUÉS de supabase-delivery-system.sql
-- ============================================

-- Primero insertar todas las localidades
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

-- Ahora insertar los lugares para cada localidad
-- Nota: Necesitas obtener los IDs de las localidades primero
-- Puedes usar esta consulta para obtener los IDs:
-- SELECT id, nombre FROM delivery_areas ORDER BY nombre;

-- Luego insertar los lugares usando los IDs correspondientes
-- Ejemplo (reemplaza LOS_IDS con los IDs reales):

-- ALAMAR
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Celimarina', 2000 FROM delivery_areas WHERE nombre = 'Alamar';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'La Curva', 1600 FROM delivery_areas WHERE nombre = 'Alamar';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Micro X', 1800 FROM delivery_areas WHERE nombre = 'Alamar';

-- ARROYO NARANJO
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Arroyo Apolo', 1800 FROM delivery_areas WHERE nombre = 'Arroyo Naranjo';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Calabazar', 3000 FROM delivery_areas WHERE nombre = 'Arroyo Naranjo';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'El Capri', 2400 FROM delivery_areas WHERE nombre = 'Arroyo Naranjo';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Fortuna', 2400 FROM delivery_areas WHERE nombre = 'Arroyo Naranjo';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Güinera', 2400 FROM delivery_areas WHERE nombre = 'Arroyo Naranjo';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'La Palma', 2000 FROM delivery_areas WHERE nombre = 'Arroyo Naranjo';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Las Guasimas', 3000 FROM delivery_areas WHERE nombre = 'Arroyo Naranjo';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Los Pinos', 2200 FROM delivery_areas WHERE nombre = 'Arroyo Naranjo';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Mantilla', 2000 FROM delivery_areas WHERE nombre = 'Arroyo Naranjo';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Párraga', 2000 FROM delivery_areas WHERE nombre = 'Arroyo Naranjo';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Perla', 2400 FROM delivery_areas WHERE nombre = 'Arroyo Naranjo';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Víbora Park', 2000 FROM delivery_areas WHERE nombre = 'Arroyo Naranjo';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Vieja Linda', 2000 FROM delivery_areas WHERE nombre = 'Arroyo Naranjo';

-- BAHIA
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Bahia', 800 FROM delivery_areas WHERE nombre = 'Bahia';

-- BOCA CIEGA
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Boca Ciega', 3000 FROM delivery_areas WHERE nombre = 'Boca Ciega';

-- BOYEROS
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Abel Santamaría', 3500 FROM delivery_areas WHERE nombre = 'Boyeros';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Alta Habana', 2500 FROM delivery_areas WHERE nombre = 'Boyeros';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Capdevila', 2500 FROM delivery_areas WHERE nombre = 'Boyeros';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'El Chico', 4000 FROM delivery_areas WHERE nombre = 'Boyeros';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'El Globo', 3500 FROM delivery_areas WHERE nombre = 'Boyeros';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Fontanal', 3200 FROM delivery_areas WHERE nombre = 'Boyeros';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Frank País', 4000 FROM delivery_areas WHERE nombre = 'Boyeros';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Lutgardita', 3300 FROM delivery_areas WHERE nombre = 'Boyeros';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Managua', 4000 FROM delivery_areas WHERE nombre = 'Boyeros';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Rio Verde', 3200 FROM delivery_areas WHERE nombre = 'Boyeros';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Santiago de las Vegas', 4000 FROM delivery_areas WHERE nombre = 'Boyeros';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Terminal 1', 3200 FROM delivery_areas WHERE nombre = 'Boyeros';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Wajay', 3600 FROM delivery_areas WHERE nombre = 'Boyeros';

-- CAMILO CIENFUEGOS
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Camilo Cienfuegos', 1600 FROM delivery_areas WHERE nombre = 'Camilo Cienfuegos';

-- CAMPO FLORIDO
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Campo Florido', 3500 FROM delivery_areas WHERE nombre = 'Campo Florido';

-- CENTRO HABANA
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Centro Habana', 2000 FROM delivery_areas WHERE nombre = 'Centro Habana';

-- CERRO
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Casino Deportivo', 2200 FROM delivery_areas WHERE nombre = 'Cerro';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Covadonga', 2000 FROM delivery_areas WHERE nombre = 'Cerro';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'El Canal', 2000 FROM delivery_areas WHERE nombre = 'Cerro';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Esquina de Tejas', 2000 FROM delivery_areas WHERE nombre = 'Cerro';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Martí', 2200 FROM delivery_areas WHERE nombre = 'Cerro';

-- COJIMAR
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Cojimar', 1400 FROM delivery_areas WHERE nombre = 'Cojimar';

-- COTORRO
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, '4 Caminos', 3000 FROM delivery_areas WHERE nombre = 'Cotorro';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Alberro', 2400 FROM delivery_areas WHERE nombre = 'Cotorro';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Bello Palmar', 2000 FROM delivery_areas WHERE nombre = 'Cotorro';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Loma de Tierra', 2600 FROM delivery_areas WHERE nombre = 'Cotorro';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Lotería', 2200 FROM delivery_areas WHERE nombre = 'Cotorro';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Paradero', 2000 FROM delivery_areas WHERE nombre = 'Cotorro';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Puente Cotorro', 2000 FROM delivery_areas WHERE nombre = 'Cotorro';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Santa María del Rosario', 2000 FROM delivery_areas WHERE nombre = 'Cotorro';

-- GUANABACOA
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Alturas de Villa María', 700 FROM delivery_areas WHERE nombre = 'Guanabacoa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Bacuranao', 1700 FROM delivery_areas WHERE nombre = 'Guanabacoa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Barrera', 1800 FROM delivery_areas WHERE nombre = 'Guanabacoa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Chivaz', 600 FROM delivery_areas WHERE nombre = 'Guanabacoa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'El Roble', 400 FROM delivery_areas WHERE nombre = 'Guanabacoa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Escala', 400 FROM delivery_areas WHERE nombre = 'Guanabacoa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Habana Nueva', 500 FROM delivery_areas WHERE nombre = 'Guanabacoa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'La Ceiba', 400 FROM delivery_areas WHERE nombre = 'Guanabacoa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'La Gallega', 1500 FROM delivery_areas WHERE nombre = 'Guanabacoa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'La Hata', 400 FROM delivery_areas WHERE nombre = 'Guanabacoa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'La Lima', 600 FROM delivery_areas WHERE nombre = 'Guanabacoa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'La Yuca', 1200 FROM delivery_areas WHERE nombre = 'Guanabacoa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Las Minas', 1700 FROM delivery_areas WHERE nombre = 'Guanabacoa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Mambi', 400 FROM delivery_areas WHERE nombre = 'Guanabacoa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Nalon', 500 FROM delivery_areas WHERE nombre = 'Guanabacoa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Parque de Guanabacoa', 400 FROM delivery_areas WHERE nombre = 'Guanabacoa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Peñalver (Repollo)', 1600 FROM delivery_areas WHERE nombre = 'Guanabacoa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Reparto Militar (Roble)', 500 FROM delivery_areas WHERE nombre = 'Guanabacoa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Ricabal', 500 FROM delivery_areas WHERE nombre = 'Guanabacoa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Santa Fe', 1000 FROM delivery_areas WHERE nombre = 'Guanabacoa';

-- GUANABO
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Guanabo', 4000 FROM delivery_areas WHERE nombre = 'Guanabo';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Peñas Altas', 4000 FROM delivery_areas WHERE nombre = 'Guanabo';

-- HABANA VIEJA
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Habana Vieja', 1500 FROM delivery_areas WHERE nombre = 'Habana Vieja';

-- LA LISA
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Arroyo Arenas', 4000 FROM delivery_areas WHERE nombre = 'La Lisa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Barbosa', 4000 FROM delivery_areas WHERE nombre = 'La Lisa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Coronela', 4000 FROM delivery_areas WHERE nombre = 'La Lisa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Hosp Frank País', 3500 FROM delivery_areas WHERE nombre = 'La Lisa';

-- LAWTON
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Porvenir y Dolores', 2000 FROM delivery_areas WHERE nombre = 'Lawton';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Vista Alegre', 2000 FROM delivery_areas WHERE nombre = 'Lawton';

-- LUYANO
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Benefica', 1600 FROM delivery_areas WHERE nombre = 'Luyano';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Hijas de Galicia', 1600 FROM delivery_areas WHERE nombre = 'Luyano';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Toyo', 1800 FROM delivery_areas WHERE nombre = 'Luyano';

-- MARIANAO
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Altura de Belen', 2500 FROM delivery_areas WHERE nombre = 'Marianao';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Ceguera', 2500 FROM delivery_areas WHERE nombre = 'Marianao';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Cujae', 3000 FROM delivery_areas WHERE nombre = 'Marianao';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Los Angeles', 3000 FROM delivery_areas WHERE nombre = 'Marianao';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Pogoloti', 2800 FROM delivery_areas WHERE nombre = 'Marianao';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Zamora', 3000 FROM delivery_areas WHERE nombre = 'Marianao';

-- N VEDADO
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'N Vedado', 2200 FROM delivery_areas WHERE nombre = 'N Vedado';

-- PLAYA
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, '3ra y 70', 2800 FROM delivery_areas WHERE nombre = 'Playa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Almendares', 2500 FROM delivery_areas WHERE nombre = 'Playa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Buena Vista', 2700 FROM delivery_areas WHERE nombre = 'Playa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Cubanacan', 3200 FROM delivery_areas WHERE nombre = 'Playa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'El Roble', 4500 FROM delivery_areas WHERE nombre = 'Playa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Flores', 3500 FROM delivery_areas WHERE nombre = 'Playa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Jaimanita', 4000 FROM delivery_areas WHERE nombre = 'Playa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Kholy', 2500 FROM delivery_areas WHERE nombre = 'Playa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'La Sierra', 2600 FROM delivery_areas WHERE nombre = 'Playa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Náutico', 3200 FROM delivery_areas WHERE nombre = 'Playa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Paradero d Playa', 3000 FROM delivery_areas WHERE nombre = 'Playa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Puente Grande', 2200 FROM delivery_areas WHERE nombre = 'Playa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Querejeta', 3000 FROM delivery_areas WHERE nombre = 'Playa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Santa Fé', 4500 FROM delivery_areas WHERE nombre = 'Playa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Siboney', 3500 FROM delivery_areas WHERE nombre = 'Playa';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Teatro Karl Marx', 2500 FROM delivery_areas WHERE nombre = 'Playa';

-- PLAZA
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Plaza', 2200 FROM delivery_areas WHERE nombre = 'Plaza';

-- REGLA
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Regla', 800 FROM delivery_areas WHERE nombre = 'Regla';

-- REPARTO ELÉCTRICO
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Reparto Eléctrico', 2700 FROM delivery_areas WHERE nombre = 'Reparto Eléctrico';

-- SAN MIGUEL DEL PADRÓN
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Altura de Luyano', 1400 FROM delivery_areas WHERE nombre = 'San Miguel del Padrón';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Barrio Obrero', 1200 FROM delivery_areas WHERE nombre = 'San Miguel del Padrón';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Cuevita', 1800 FROM delivery_areas WHERE nombre = 'San Miguel del Padrón';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Garita Diezmero', 2000 FROM delivery_areas WHERE nombre = 'San Miguel del Padrón';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'La Cumbre', 2000 FROM delivery_areas WHERE nombre = 'San Miguel del Padrón';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Loma de los Zapotes', 1500 FROM delivery_areas WHERE nombre = 'San Miguel del Padrón';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Rebolledo', 2000 FROM delivery_areas WHERE nombre = 'San Miguel del Padrón';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'San Francisco', 2100 FROM delivery_areas WHERE nombre = 'San Miguel del Padrón';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Siboney', 2100 FROM delivery_areas WHERE nombre = 'San Miguel del Padrón';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Virgen del Camino', 1400 FROM delivery_areas WHERE nombre = 'San Miguel del Padrón';

-- VEDADO
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Habana Libre', 2000 FROM delivery_areas WHERE nombre = 'Vedado';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Linea y 12', 2200 FROM delivery_areas WHERE nombre = 'Vedado';

-- VÍBORA
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Monaco', 2000 FROM delivery_areas WHERE nombre = 'Víbora';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Santo Suárez', 2000 FROM delivery_areas WHERE nombre = 'Víbora';
INSERT INTO delivery_places (area_id, nombre, precio) 
SELECT id, 'Sevillano', 2000 FROM delivery_areas WHERE nombre = 'Víbora';

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
