# 🔧 Solución: Error al Subir Imágenes al Bucket

Si al intentar subir una imagen desde el panel admin te da error, sigue estos pasos:

## ✅ Checklist de Verificación

### 1. Verificar que el bucket existe

Ve a **Supabase Dashboard → Storage** en la barra lateral.

Debes ver un bucket llamado `products`. Si no existe:

1. Click en **"New bucket"**
2. Nombre: `products` (exactamente así, en minúsculas)
3. ✅ Activa **"Public bucket"**
4. Click en **"Create bucket"**

### 2. Ejecutar las políticas de Storage

Este es el paso más importante. Las políticas RLS de storage son independientes de las políticas de las tablas.

1. Ve a **SQL Editor** en Supabase
2. Click en **"New query"**
3. **Copia y pega TODO el contenido del archivo `supabase-storage-policies.sql`**
4. Click en **"Run"**

Esto crea 4 políticas:
- ✅ Lectura pública de imágenes
- ✅ Subida para usuarios autenticados
- ✅ Actualización para usuarios autenticados
- ✅ Eliminación para usuarios autenticados

### 3. Verificar que estás logueado

Las políticas de subida requieren que estés autenticado. Si acabas de crear el usuario admin:

1. Cierra sesión en el panel admin
2. Vuelve a iniciar sesión en `/admin/login`
3. Intenta subir la imagen de nuevo

### 4. Verificar tamaño del archivo

El código valida que la imagen no supere los **5MB**. Si tu imagen es más grande:
- Comprímela primero (puedes usar [tinypng.com](https://tinypng.com))
- O conviértela a JPG (suele pesar menos que PNG)

## 🐛 Mensajes de Error Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `new row violates row-level security policy` | Faltan políticas de storage | Ejecuta `supabase-storage-policies.sql` |
| `The resource already exists` | Ya existe un archivo con ese nombre | El código usa timestamp, recarga la página |
| `Bucket not found` | El bucket no existe | Crea el bucket `products` en Storage |
| `The bucket is not public` | El bucket es privado | Edita el bucket y activa "Public bucket" |
| `new row violates check option` | Intentas subir a otro bucket | Verifica que el nombre sea `products` |

## 🔍 Verificación Manual

Puedes verificar que todo esté bien ejecutando esta consulta en el SQL Editor:

```sql
-- Ver buckets existentes
SELECT name, public FROM storage.buckets;

-- Ver políticas del bucket products
SELECT * FROM pg_policies WHERE tablename = 'objects' 
AND schemaname = 'storage';
```

Deberías ver:
- El bucket `products` con `public = true`
- 4 políticas relacionadas con `bucket_id = 'products'`

## 💡 Alternativa: Subir por URL

Si sigues teniendo problemas con el bucket, puedes:

1. Subir la imagen a un servicio como [imgur.com](https://imgur.com) o [postimages.org](https://postimages.org)
2. Copiar la URL directa de la imagen
3. Pegarla en el campo "URL de imagen" del formulario de producto

Esta alternativa funciona sin necesidad del bucket de Supabase.

## 📞 Si nada funciona

1. Abre la consola del navegador (F12)
2. Intenta subir una imagen
3. Copia el error exacto que aparece en rojo
4. Verifica los logs en Supabase: **Dashboard → Logs → API**
