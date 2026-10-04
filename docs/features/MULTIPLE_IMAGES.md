# 📸 Sistema de Múltiples Imágenes por Producto

## ✨ Nueva Funcionalidad

Ahora puedes subir **múltiples imágenes** para cada producto y los clientes podrán verlas en un **carrusel interactivo** en la vista detallada.

---

## 🗄️ Base de Datos

### Script de Migración

Ejecuta el archivo `supabase-multiple-images.sql` en el SQL Editor de Supabase para:

1. Crear la tabla `product_images`
2. Configurar políticas RLS
3. Migrar las imágenes existentes

```sql
-- Resumen de lo que hace el script:
CREATE TABLE product_images (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🛠️ Panel de Administración

### Subir Múltiples Imágenes

1. **Botón de subida mejorado**: Ahora dice "📷 Subir imágenes (puedes seleccionar varias)"
2. **Selección múltiple**: Puedes seleccionar varias imágenes a la vez desde tu dispositivo
3. **Validaciones**:
   - Solo imágenes (JPG, PNG, WebP)
   - Máximo 5MB por imagen
   - Mensajes de error claros

### Gestionar Imágenes

Una vez subidas, verás una galería con:

- **Badge "Principal"**: La primera imagen es la principal (se muestra en el catálogo)
- **Flechas ← →**: Para reordenar las imágenes al pasar el mouse
- **Botón X**: Para eliminar una imagen específica
- **Contador**: Muestra cuántas imágenes tienes

### Orden de las Imágenes

- La **primera imagen** es la principal (se muestra en tarjetas del catálogo)
- Puedes reordenarlas usando las flechas
- El orden se guarda al actualizar el producto

---

## 🛍️ Vista del Cliente

### Carrusel de Imágenes

Cuando un cliente hace clic en un producto, verá:

1. **Imagen principal grande** (aspecto cuadrado)
2. **Flechas de navegación** (← →) si hay más de una imagen
3. **Contador de imágenes** (ej: "2 / 5") en la parte inferior
4. **Indicadores de puntos** (si hay 6 o menos imágenes)
5. **Miniaturas** debajo de la imagen principal para acceso rápido

### Interacciones

- **Swipe/Tap en móvil**: Funciona con gestos táctiles
- **Click en flechas**: Navegación clásica
- **Click en miniaturas**: Salto directo a cualquier imagen
- **Click en puntos**: Navegación rápida

### Compatibilidad

- ✅ Productos con 1 imagen: Se muestra normalmente (sin carrusel)
- ✅ Productos con múltiples imágenes: Carrusel completo
- ✅ Productos sin imágenes: Muestra placeholder "Sin imagen"
- ✅ Productos legacy (sin tabla images): Usa `image_url` como fallback

---

## 📋 Flujo de Trabajo

### Para el Administrador

```
1. Crear/Editar producto
2. Click en "📷 Subir imágenes"
3. Seleccionar múltiples archivos
4. Esperar subida (verás progreso)
5. Reordenar si es necesario (flechas ← →)
6. Click en "Guardar Producto"
```

### Para el Cliente

```
1. Ver producto en catálogo (imagen principal)
2. Click en el producto
3. Ver carrusel con todas las imágenes
4. Navegar con flechas, miniaturas o puntos
5. Seleccionar jugador/talla
6. Agregar al carrito
```

---

## 🔧 Detalles Técnicos

### Estructura de Datos

```typescript
interface Product {
  id: string;
  name: string;
  image_url: string; // Imagen principal (compatibilidad)
  images?: ProductImage[]; // Todas las imágenes
  // ... otros campos
}

interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number; // Orden de visualización
}
```

### Consultas SQL

**Cargar productos con imágenes:**
```sql
SELECT *, 
  variants:product_variants(*), 
  images:product_images(*)
FROM products
ORDER BY created_at DESC;
```

**Guardar imágenes:**
```sql
-- Al crear/actualizar producto:
1. Eliminar imágenes anteriores
2. Insertar nuevas imágenes con display_order
```

### Almacenamiento

- Las imágenes se suben al bucket `products` de Supabase Storage
- Nombre de archivo: `{timestamp}_{index}.{ext}`
- URLs públicas accesibles desde el CDN de Supabase

---

## 🎨 Componentes Actualizados

### `AdminDashboard.tsx`
- Nueva función `uploadImages()` para subida múltiple
- Funciones `removeImage()` y `moveImage()` para gestión
- Galería visual con controles de reordenamiento
- Estado `productImages` para manejar la lista

### `ProductModal.tsx`
- Nuevo estado `currentImageIndex` para el carrusel
- Funciones `nextImage()` y `prevImage()`
- Flechas de navegación superpuestas
- Miniaturas debajo de la imagen principal
- Contador de imágenes
- Indicadores de puntos

### `Catalog.tsx`
- Consulta actualizada para incluir `images:product_images(*)`

---

## ✅ Checklist de Implementación

- [x] Crear tabla `product_images` en Supabase
- [x] Configurar políticas RLS
- [x] Actualizar tipos TypeScript
- [x] Modificar AdminDashboard para subida múltiple
- [x] Agregar gestión de imágenes (reordenar/eliminar)
- [x] Actualizar ProductModal con carrusel
- [x] Agregar miniaturas y navegación
- [x] Mantener compatibilidad con `image_url` legacy
- [x] Actualizar consultas SQL en Catalog
- [x] Build exitoso sin errores

---

## 🚀 Próximos Pasos

1. **Ejecutar el script SQL** en Supabase
2. **Probar la subida múltiple** en el panel admin
3. **Verificar el carrusel** en la vista del cliente
4. **Opcional**: Agregar zoom en las imágenes
5. **Opcional**: Agregar modo pantalla completa

---

## 💡 Tips

- **Optimiza las imágenes** antes de subirlas (menos de 5MB)
- **Usa formato WebP** para mejor compresión
- **La primera imagen es la más importante** (se ve en el catálogo)
- **Máximo recomendado**: 5-6 imágenes por producto
- **Reordena antes de guardar** para evitar confusiones

---

**Fecha de implementación**: 2026-01-27  
**Versión**: 3.0 - Sistema de Múltiples Imágenes
