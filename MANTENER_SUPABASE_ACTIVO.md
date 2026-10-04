# 🔧 Mantener Supabase Activo - Guía Completa

## 📋 ¿Por qué necesitas esto?

Supabase en el **plan gratuito** pausa automáticamente los proyectos después de **7 días sin actividad** en la base de datos. Este script ejecuta una consulta cada **3 días** para mantener tu proyecto activo.

## ✅ Solución Implementada

El script usa **fetch nativo de Node.js** (sin dependencias externas) para hacer una petición REST directa a Supabase. Esto es:
- **Más rápido**: No necesita instalar paquetes
- **Más simple**: Sin problemas de compatibilidad
- **Más confiable**: No depende de versiones de librerías

---

## 🚀 Opción 1: GitHub Actions (Recomendada)

### ✅ Ventajas
- **100% Gratis**
- **No requiere infraestructura adicional**
- **Fácil de configurar**
- **Ya tienes el código en GitHub**
- **Logs disponibles para verificar**

### 📝 Configuración Paso a Paso

#### 1. Agregar Secrets en GitHub

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Secrets and variables** → **Actions**
4. Click en **New repository secret**
5. Agrega estos dos secrets:

**Secret 1:**
- **Name**: `SUPABASE_URL`
- **Value**: `https://yyfpiyjwtrrvrsbmtgog.supabase.co`

**Secret 2:**
- **Name**: `SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (tu anon key completa)

6. Click en **Add secret**

#### 2. Verificar el Workflow

El archivo `.github/workflows/keep-supabase-active.yml` ya está creado y configurado para:
- Ejecutarse **cada 3 días** a las 00:00 UTC
- Hacer una consulta simple a la tabla `products`
- Registrar el resultado en los logs

#### 3. Probar Manualmente (Opcional)

Puedes ejecutar el workflow manualmente para verificar que funciona:

1. Ve a la pestaña **Actions** en tu repositorio
2. Click en **Keep Supabase Active** en el menú lateral
3. Click en **Run workflow** → **Run workflow**
4. Espera unos segundos y verifica que se completó exitosamente

#### 4. Verificar que Funciona

Para ver los logs de ejecución:

1. Ve a la pestaña **Actions**
2. Click en la ejecución más reciente
3. Click en **keep-alive**
4. Verás los logs con el mensaje:
   ```
   ✅ Database ping successful!
   📊 Total products in database: X
   ⏰ Timestamp: 2026-01-27T...
   ```

---

## 🌩️ Opción 2: Cloudflare Workers (Alternativa)

Si prefieres usar Cloudflare (ya que estás usando Cloudflare Pages), puedes crear un Worker con Cron Trigger.

### ✅ Ventajas
- **Gratis** (100,000 requests/día)
- **Más rápido** que GitHub Actions
- **No depende de GitHub**
- **Logs en Cloudflare**

### 📝 Configuración

#### 1. Crear el Worker

Crea un archivo `worker.js`:

```javascript
export default {
  async scheduled(event, env, ctx) {
    try {
      const response = await fetch(
        `${env.SUPABASE_URL}/rest/v1/products?select=id&limit=1`,
        {
          headers: {
            'apikey': env.SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`
          }
        }
      );
      
      if (response.ok) {
        console.log('✅ Supabase ping successful');
      } else {
        console.error('❌ Supabase ping failed:', response.status);
      }
    } catch (error) {
      console.error('❌ Error:', error);
    }
  }
};
```

#### 2. Crear wrangler.toml

```toml
name = "keep-supabase-active"
main = "worker.js"
compatibility_date = "2024-01-01"

[triggers]
crons = ["0 0 */3 * *"]  # Cada 3 días

[vars]
SUPABASE_URL = "https://yyfpiyjwtrrvrsbmtgog.supabase.co"
SUPABASE_ANON_KEY = "tu-anon-key-aqui"
```

#### 3. Desplegar el Worker

```bash
# Instalar Wrangler CLI
npm install -g wrangler

# Login en Cloudflare
wrangler login

# Desplegar
wrangler deploy
```

---

## 🔍 Verificación y Monitoreo

### GitHub Actions

#### Ver Ejecuciones
```
GitHub → Tu Repositorio → Actions → Keep Supabase Active
```

#### Ver Logs
```
Click en la ejecución → keep-alive → Ver logs
```

#### Frecuencia
- **Automático**: Cada 3 días
- **Manual**: Cuando quieras desde la pestaña Actions

### Cloudflare Workers

#### Ver Logs
```
Cloudflare Dashboard → Workers & Pages → Tu Worker → Logs
```

#### Ver Triggers
```
Cloudflare Dashboard → Workers & Pages → Tu Worker → Triggers
```

---

## 🛠️ Troubleshooting

### ❌ Error: "Node.js detected but native WebSocket not found"

**Causa**: La versión antigua del script usaba `@supabase/supabase-js` que requiere Node.js 22+

**Solución**: ✅ **Ya corregido**. El script ahora usa `fetch` nativo sin dependencias. Solo haz commit y push de los cambios:
```bash
git add .
git commit -m "Fix: usar fetch nativo en lugar de supabase-js"
git push
```

### ❌ Error: "SUPABASE_URL and SUPABASE_ANON_KEY must be set"

**Causa**: No configuraste los secrets en GitHub

**Solución**:
1. Ve a Settings → Secrets and variables → Actions
2. Agrega `SUPABASE_URL` y `SUPABASE_ANON_KEY`

### ❌ Error: "relation 'products' does not exist"

**Causa**: La tabla `products` no existe o tiene otro nombre

**Solución**:
1. Edita `keep-supabase-active.js`
2. Cambia `'products'` por el nombre de tu tabla
3. O usa una consulta más simple:

```javascript
const { data, error } = await supabase.rpc('health_check');
```

Y crea esta función en Supabase:

```sql
CREATE OR REPLACE FUNCTION health_check()
RETURNS integer AS $$
BEGIN
  RETURN 1;
END;
$$ LANGUAGE plpgsql;
```

### ❌ Error: "Invalid API key"

**Causa**: La anon key es incorrecta

**Solución**:
1. Ve a Supabase → Settings → API
2. Copia la **anon public** key (NO la service_role)
3. Actualiza el secret en GitHub

### ❌ El workflow no se ejecuta

**Causa**: GitHub puede retrasar los workflows programados

**Solución**:
1. Verifica que el workflow esté habilitado
2. Ejecútalo manualmente para probar
3. Revisa los logs para ver el error

---

## 📊 Comparación de Opciones

| Característica | GitHub Actions | Cloudflare Workers |
|----------------|----------------|-------------------|
| **Costo** | Gratis | Gratis |
| **Facilidad** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Velocidad** | ~30s | ~1s |
| **Logs** | GitHub | Cloudflare |
| **Dependencias** | GitHub | Cloudflare |
| **Configuración** | 5 min | 10 min |
| **Recomendado para** | Principiantes | Avanzados |

---

## 🎯 Recomendación

**Usa GitHub Actions** porque:
- ✅ Ya tienes el código en GitHub
- ✅ Configuración más simple
- ✅ No necesitas instalar nada
- ✅ Logs fáciles de ver
- ✅ Puedes ejecutarlo manualmente cuando quieras

---

## 📅 Calendario de Ejecución

El workflow se ejecuta automáticamente:

```
Día 1: 00:00 UTC ✅
Día 4: 00:00 UTC ✅
Día 7: 00:00 UTC ✅ (justo antes de que Supabase pause)
Día 10: 00:00 UTC ✅
...
```

**Nota**: GitHub Actions puede tener un retraso de hasta 15 minutos en la ejecución programada.

---

## 🔐 Seguridad

### ¿Es seguro usar la anon key?

**Sí**, la anon key está diseñada para ser pública:
- ✅ Tiene permisos limitados (solo lectura para tablas públicas)
- ✅ Las políticas RLS protegen tus datos
- ✅ No puede modificar la estructura de la base de datos
- ✅ Es la misma key que usas en tu frontend

### ¿Qué pasa si alguien ve la key?

**Nada malo**, porque:
- La anon key solo puede hacer lo que las políticas RLS permiten
- En tu caso, las tablas son de lectura pública
- No puede eliminar datos ni modificar la estructura

---

## 🚀 Próximos Pasos

1. ✅ **Configurar los secrets en GitHub** (5 min)
2. ✅ **Ejecutar el workflow manualmente** para probar (1 min)
3. ✅ **Verificar los logs** que todo funcione (1 min)
4. ✅ **¡Listo!** Tu base de datos se mantendrá activa automáticamente

---

## 📞 Soporte

Si tienes problemas:

1. **Revisa los logs** en GitHub Actions
2. **Verifica los secrets** que estén correctos
3. **Prueba manualmente** el workflow
4. **Consulta la documentación** de Supabase sobre límites del plan gratuito

---

## 🎉 Conclusión

Con esta configuración:
- ✅ Tu base de datos **nunca se pausará**
- ✅ No tienes que hacer **nada manual**
- ✅ Es **100% gratis**
- ✅ Puedes **monitorear** las ejecuciones
- ✅ Puedes **ejecutar manualmente** si quieres

**¡Tu Supabase estará activo para siempre!** 🚀

---

**Fecha**: 2026-01-27  
**Versión**: 1.0  
**Estado**: ✅ Listo para usar
