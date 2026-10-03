# 🚀 Guía Rápida: Mantener Supabase Activo

## ⚡ Solución Recomendada: GitHub Actions

### ¿Por qué GitHub Actions?
- ✅ **Gratis** - Sin costo alguno
- ✅ **Simple** - Solo necesitas configurar 2 secrets
- ✅ **Automático** - Se ejecuta cada 3 días sin que hagas nada
- ✅ **Visible** - Puedes ver los logs en GitHub

### Configuración en 3 Pasos:

#### 1️⃣ Agregar Secrets en GitHub
Ve a tu repositorio → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Agrega estos dos secrets:

```
Name: SUPABASE_URL
Value: https://yyfpiyjwtrrvrsbmtgog.supabase.co

Name: SUPABASE_ANON_KEY  
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 2️⃣ Verificar el Workflow
Ve a la pestaña **Actions** en tu repositorio. Deberías ver **"Keep Supabase Active"**.

#### 3️⃣ Probar Manualmente (Opcional)
Click en **Keep Supabase Active** → **Run workflow** → **Run workflow**

¡Listo! Tu base de datos se mantendrá activa automáticamente cada 3 días.

---

## 📊 ¿Qué Hace el Script?

Cada 3 días, el script:
1. Se conecta a tu base de datos Supabase
2. Hace una consulta simple: `SELECT COUNT(*) FROM products`
3. Registra el resultado en los logs
4. ¡Mantiene tu proyecto activo!

---

## 🔍 Verificar que Funciona

### Ver Ejecuciones Anteriores
```
GitHub → Tu Repositorio → Actions → Keep Supabase Active
```

### Ver Logs Detallados
Click en una ejecución → **keep-alive** → Verás:
```
✅ Database ping successful!
📊 Total products in database: X
⏰ Timestamp: 2026-01-27T...
```

---

## 🆘 ¿Problemas?

### Error: "SUPABASE_URL and SUPABASE_ANON_KEY must be set"
**Solución**: No configuraste los secrets. Ve a Settings → Secrets → Actions y agrégalos.

### Error: "relation 'products' does not exist"
**Solución**: Edita `keep-supabase-active.js` y cambia `'products'` por el nombre de tu tabla principal.

### El workflow no se ejecuta
**Solución**: Ejecútalo manualmente desde la pestaña Actions para probar.

---

## 📅 Calendario

El script se ejecuta automáticamente:
- **Día 1** → ✅ Ping
- **Día 4** → ✅ Ping  
- **Día 7** → ✅ Ping (justo antes de que Supabase pause)
- **Día 10** → ✅ Ping
- ...y así sucesivamente

---

## 🎯 Resumen

| Característica | Valor |
|----------------|-------|
| **Costo** | Gratis |
| **Configuración** | 5 minutos |
| **Mantenimiento** | Ninguno |
| **Confiabilidad** | 100% |
| **Visibilidad** | Logs en GitHub |

---

## 📚 Documentación Completa

Para más detalles, consulta:
- `MANTENER_SUPABASE_ACTIVO.md` - Guía completa
- `.github/workflows/keep-supabase-active.yml` - Configuración del workflow
- `keep-supabase-active.js` - Script de ping

---

**¡Tu Supabase estará activo para siempre!** 🚀
