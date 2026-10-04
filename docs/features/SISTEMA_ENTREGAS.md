# 🚚 Sistema de Entregas Jerárquico

## 📋 Descripción General

El sistema de entregas ha sido completamente rediseñado para soportar una estructura jerárquica de **Localidades → Puntos de Entrega**, permitiendo una gestión más granular y precisa de las zonas de entrega y sus precios.

## 🏗️ Estructura de Datos

### Tabla `delivery_areas` (Localidades)
```sql
CREATE TABLE delivery_areas (
  id UUID PRIMARY KEY,
  nombre TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Ejemplos de localidades:**
- Alamar
- Playa
- Vedado
- Centro Habana
- Guanabacoa
- Boyeros
- etc.

### Tabla `delivery_places` (Puntos de Entrega)
```sql
CREATE TABLE delivery_places (
  id UUID PRIMARY KEY,
  area_id UUID REFERENCES delivery_areas(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  precio INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Ejemplo de estructura:**
```
Localidad: Playa
├── Punto: Cubanacán (3200 CUP)
├── Punto: Siboney (3500 CUP)
├── Punto: Flores (3500 CUP)
├── Punto: Jaimanitas (4000 CUP)
└── Punto: Santa Fé (4500 CUP)
```

## 🎯 Flujo de Usuario (Cliente)

### 1. Selección de Localidad
El cliente primero selecciona la **localidad** donde desea recibir su pedido:
- Dropdown con todas las localidades disponibles
- Ejemplo: "Playa", "Vedado", "Centro Habana"

### 2. Selección de Punto de Entrega
Después de seleccionar la localidad, aparece un segundo dropdown con los **puntos de entrega específicos** de esa localidad:
- Cada punto muestra su nombre y precio
- Ejemplo: "Cubanacán - 3200 CUP"

### 3. Cálculo Automático
El precio de envío se calcula automáticamente según el punto de entrega seleccionado y se muestra en el resumen del pedido.

### 4. Mensaje de WhatsApp
El mensaje prearmado incluye:
```
📍 Localidad: Playa
🏠 Punto de entrega: Cubanacán
💰 Envío: 3200 CUP
```

## 🛠️ Panel de Administración

### Pestaña "Entregas"

#### Gestión de Localidades
- **Crear nueva localidad**: Botón "Nueva Localidad"
- **Editar localidad**: Icono de lápiz (✏️)
- **Eliminar localidad**: Icono de papelera (🗑️) - Elimina también todos sus puntos de entrega

#### Gestión de Puntos de Entrega
Cada localidad muestra:
- Lista de puntos de entrega con nombre y precio
- Botón para eliminar cada punto (X)
- Formulario inline para agregar nuevos puntos:
  - Campo: Nombre del lugar
  - Campo: Precio (CUP)
  - Botón: "Agregar"

### Interfaz Visual
```
┌─────────────────────────────────────────┐
│ Localidades y Puntos de Entrega         │
│ [+ Nueva Localidad]                     │
├─────────────────────────────────────────┤
│ 📍 Playa (5 puntos)          [✏️] [🗑️] │
├─────────────────────────────────────────┤
│ • Cubanacán          3200 CUP    [X]   │
│ • Siboney            3500 CUP    [X]   │
│ • Flores             3500 CUP    [X]   │
│ • Jaimanitas         4000 CUP    [X]   │
│ • Santa Fé           4500 CUP    [X]   │
├─────────────────────────────────────────┤
│ Agregar punto de entrega:               │
│ [Nombre del lugar] [Precio CUP] [Agregar]│
└─────────────────────────────────────────┘
```

## 📊 Datos Iniciales

El sistema incluye **26 localidades** con un total de **aproximadamente 150 puntos de entrega** preconfigurados:

### Localidades Principales
1. Alamar (3 puntos)
2. Arroyo Naranjo (13 puntos)
3. Bahia (1 punto)
4. Boca Ciega (1 punto)
5. Boyeros (13 puntos)
6. Camilo Cienfuegos (1 punto)
7. Campo Florido (1 punto)
8. Centro Habana (1 punto)
9. Cerro (5 puntos)
10. Cojimar (1 punto)
11. Cotorro (8 puntos)
12. Guanabacoa (20 puntos)
13. Guanabo (2 puntos)
14. Habana Vieja (1 punto)
15. La Lisa (4 puntos)
16. Lawton (2 puntos)
17. Luyano (3 puntos)
18. Marianao (6 puntos)
19. N Vedado (1 punto)
20. Playa (16 puntos)
21. Plaza (1 punto)
22. Regla (1 punto)
23. Reparto Eléctrico (1 punto)
24. San Miguel del Padrón (10 puntos)
25. Vedado (2 puntos)
26. Víbora (3 puntos)

### Rango de Precios
- **Mínimo**: 400 CUP (El Roble, Escala, La Ceiba, etc.)
- **Máximo**: 4500 CUP (El Roble Playa, Santa Fé)
- **Promedio**: 2000-3000 CUP

## 🔧 Instalación

### Paso 1: Crear Tablas
Ejecutar `supabase-delivery-system.sql` en el SQL Editor de Supabase:
- Crea las tablas `delivery_areas` y `delivery_places`
- Configura políticas RLS
- Crea índices para optimización

### Paso 2: Insertar Datos
Ejecutar `supabase-delivery-data.sql` en el SQL Editor de Supabase:
- Inserta las 26 localidades
- Inserta todos los puntos de entrega con sus precios

### Paso 3: Verificar
En el panel de administración, ve a la pestaña "Entregas" y verifica que todas las localidades y puntos estén cargados correctamente.

## 💻 Implementación Técnica

### Tipos TypeScript
```typescript
export interface DeliveryLocation {
  nombre: string;
  precio: number;
}

export interface DeliveryArea {
  id: string;
  nombre: string;
  lugares: DeliveryLocation[];
}
```

### Carga de Datos (OrderForm.tsx)
```typescript
const loadAreas = async () => {
  const { data } = await supabase
    .from('delivery_areas')
    .select(`
      id,
      nombre,
      lugares:delivery_places(id, nombre, precio)
    `)
    .order('nombre');
  
  if (data) {
    setAreas(data.map(area => ({
      id: area.id,
      nombre: area.nombre,
      lugares: area.lugares.map(lugar => ({
        nombre: lugar.nombre,
        precio: lugar.precio
      }))
    })));
  }
};
```

### Selector en Cascada
```typescript
// 1. Selector de Localidad
<select value={form.area} onChange={e => setForm({...form, area: e.target.value, place: ''})}>
  <option value="">Seleccionar localidad...</option>
  {areas.map(area => (
    <option key={area.id} value={area.id}>{area.nombre}</option>
  ))}
</select>

// 2. Selector de Punto de Entrega (solo si hay localidad seleccionada)
{form.area && selectedArea && (
  <select value={form.place} onChange={e => setForm({...form, place: e.target.value})}>
    <option value="">Seleccionar punto de entrega...</option>
    {selectedArea.lugares.map(lugar => (
      <option key={lugar.nombre} value={lugar.nombre}>
        {lugar.nombre} - {lugar.precio} CUP
      </option>
    ))}
  </select>
)}
```

### Mensaje de WhatsApp
```typescript
const buildMessage = () => {
  let msg = `🛒 *NUEVO PEDIDO*\n\n`;
  // ... datos del cliente y productos ...
  
  if (deliveryPrice > 0 && selectedArea && selectedPlace) {
    msg += `🚚 *Envío:* ${deliveryPrice} CUP\n`;
    msg += `📍 *Localidad:* ${selectedArea.nombre}\n`;
    msg += `🏠 *Punto de entrega:* ${selectedPlace.nombre}\n`;
  }
  
  // ... resto del mensaje ...
  return msg;
};
```

## 🎨 Características de UX

### Para el Cliente
✅ **Selección intuitiva**: Dos dropdowns en cascada
✅ **Precio visible**: Cada punto muestra su precio
✅ **Feedback inmediato**: El precio de envío se actualiza al seleccionar
✅ **Resumen claro**: El mensaje de WhatsApp incluye toda la información

### Para el Administrador
✅ **Gestión visual**: Interfaz clara con iconos
✅ **Edición inline**: Agregar puntos sin modales
✅ **Eliminación segura**: Confirmación antes de eliminar
✅ **Contador**: Muestra cuántos puntos tiene cada localidad
✅ **Ordenamiento**: Localidades ordenadas alfabéticamente

## 🔄 Migración desde Sistema Anterior

Si tenías el sistema anterior con `delivery_zones`:

1. **NO elimines** la tabla `delivery_zones` todavía
2. Ejecuta los scripts del nuevo sistema
3. Verifica que todo funcione correctamente
4. Una vez confirmado, puedes eliminar la tabla antigua:
```sql
DROP TABLE IF EXISTS delivery_zones;
```

## 📝 Consideraciones

### Rendimiento
- Las consultas usan índices en `area_id` para optimización
- Los datos se cargan una sola vez al abrir el formulario
- El selector en cascada es reactivo y rápido

### Mantenimiento
- Agregar nuevas localidades: 1 click
- Agregar nuevos puntos: Formulario inline
- Editar precios: Eliminar y volver a agregar (o crear modal de edición)
- Eliminar localidad: Elimina automáticamente todos sus puntos (CASCADE)

### Escalabilidad
- Soporta cientos de puntos de entrega sin problemas
- Estructura jerárquica permite expansión futura (ej: agregar coordenadas GPS)
- Fácil de exportar/importar datos

## 🚀 Próximas Mejoras Sugeridas

1. **Edición inline de precios**: Poder editar el precio sin eliminar el punto
2. **Búsqueda de localidades**: Input con autocompletado para muchas localidades
3. **Importar/Exportar CSV**: Para gestión masiva de puntos
4. **Mapa interactivo**: Mostrar puntos en un mapa
5. **Rutas optimizadas**: Calcular la ruta más eficiente para el repartidor
6. **Historial de pedidos**: Ver qué zonas son más populares

## 📞 Soporte

Si encuentras algún problema:
1. Verifica que ambos scripts SQL se ejecutaron correctamente
2. Revisa la consola del navegador para errores
3. Verifica las políticas RLS en Supabase
4. Asegúrate de que el usuario admin tiene permisos de escritura

---

**Versión**: 2.0  
**Última actualización**: 2026-01-27  
**Estado**: ✅ Producción
