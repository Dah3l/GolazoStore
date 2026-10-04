# 📚 Documentación de Golazo Store

Bienvenido a la documentación completa del proyecto Golazo Store. Aquí encontrarás toda la información organizada por categorías.

## 📂 Estructura de la Documentación

### 🚀 Despliegue (`deployment/`)
Guías para configurar y desplegar la aplicación.

- [Guía Completa de Despliegue](./deployment/GUIA-DESPLEGUE.md) - Paso a paso para desplegar en Cloudflare Pages + Supabase
- [Guía Rápida Supabase](./deployment/GUIA_RAPIDA_SUPABASE.md) - Configuración rápida de Supabase

### 🔧 Mantenimiento (`maintenance/`)
Scripts y guías para mantener la aplicación activa y funcionando.

- [Mantener Supabase Activo](./maintenance/MANTENER_SUPABASE_ACTIVO.md) - Sistema automático para evitar pausas
- [Fix Error WebSocket](./maintenance/FIX_WEBSOCKET_ERROR.md) - Solución al error de WebSocket en GitHub Actions

### 🐛 Troubleshooting (`troubleshooting/`)
Soluciones a problemas comunes.

- [Troubleshooting Storage](./troubleshooting/TROUBLESHOOTING-STORAGE.md) - Problemas con subida de imágenes
- [Troubleshooting Conexión](./troubleshooting/TROUBLESHOOTING_CONEXION.md) - Errores de conexión en Cuba
- [Solución Certificados](./troubleshooting/SOLUCION_CERTIFICADOS.md) - Problemas con certificados SSL
- [Solución Certificados SSL](./troubleshooting/SOLUCION_CERTIFICADOS_SSL.md) - Guía alternativa de certificados

### ✨ Características (`features/`)
Documentación de funcionalidades implementadas.

- [Edición de Variantes](./features/EDICION_VARIANTES.md) - Cómo editar variantes de productos
- [Mejoras Modal v2](./features/MEJORAS_MODAL_V2.md) - Optimizaciones del modal de producto
- [Múltiples Imágenes](./features/MULTIPLE_IMAGES.md) - Sistema de galería de imágenes
- [Optimizaciones](./features/OPTIMIZACIONES.md) - Optimizaciones generales de UI
- [Optimización Precarga](./features/OPTIMIZACION_PRECARGA.md) - Precarga de recursos
- [Rebranding](./features/REBRANDING.md) - Cambio de marca a Golazo Store
- [Sistema de Entregas](./features/SISTEMA_ENTREGAS.md) - Sistema jerárquico de entregas
- [Animación SIUUU](./features/SIUUU_ANIMACION.md) - Animación y sonido de CR7

## 🎯 Inicio Rápido

Si eres nuevo en el proyecto, empieza aquí:

1. **[README.md](../README.md)** - Introducción al proyecto
2. **[Guía de Despliegue](./deployment/GUIA-DESPLEGUE.md)** - Cómo desplegar la aplicación
3. **[Mantener Supabase Activo](./maintenance/MANTENER_SUPABASE_ACTIVO.md)** - Configuración automática

## 📊 Estructura del Proyecto

```
golazo-store/
├── src/                    # Código fuente
│   ├── components/        # Componentes React
│   ├── context/           # Contextos globales
│   ├── hooks/             # Hooks personalizados
│   ├── lib/               # Utilidades y configuraciones
│   ├── pages/             # Páginas de la aplicación
│   └── types/             # Tipos TypeScript
├── docs/                  # Documentación (esta carpeta)
│   ├── deployment/        # Guías de despliegue
│   ├── maintenance/       # Mantenimiento
│   ├── troubleshooting/   # Solución de problemas
│   └── features/          # Características
├── cloudflare-worker/     # Worker para mantener Supabase activo
├── .github/workflows/     # GitHub Actions
├── *.sql                  # Scripts de base de datos
└── README.md              # Este archivo
```

## 🔗 Enlaces Útiles

- **Repositorio**: [GitHub](https://github.com/tu-usuario/golazo-store)
- **Producción**: [golazo-store.pages.dev](https://golazo-store.pages.dev)
- **Supabase**: [Panel de Supabase](https://app.supabase.com)
- **Cloudflare**: [Panel de Cloudflare](https://dash.cloudflare.com)

## 📝 Convenciones

- Todos los archivos de documentación están en **Markdown**
- Los nombres de archivos usan **MAYÚSCULAS** y **guiones bajos**
- Cada característica importante tiene su propio archivo de documentación
- Los troubleshooting están organizados por tipo de problema

## 🤝 Contribuir

Si quieres agregar documentación:

1. Crea un archivo `.md` en la categoría apropiada
2. Usa el formato estándar de Markdown
3. Incluye ejemplos de código cuando sea posible
4. Actualiza este README si agregas una nueva sección

---

**Última actualización**: 2026-01-27  
**Versión**: 2.0
