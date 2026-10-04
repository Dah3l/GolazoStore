#!/bin/bash

# Script para reestructurar la documentación de Golazo Store
# Ejecutar desde la raíz del proyecto: bash reestructurar-docs.sh

echo "🚀 Iniciando reestructuración de documentación..."

# Crear estructura de carpetas
echo "📁 Creando estructura de carpetas..."
mkdir -p docs/deployment
mkdir -p docs/maintenance
mkdir -p docs/troubleshooting
mkdir -p docs/features

# Mover archivos de despliegue
echo "📦 Moviendo guías de despliegue..."
mv GUIA-DESPLEGUE.md docs/deployment/ 2>/dev/null && echo "  ✅ GUIA-DESPLEGUE.md" || echo "  ⚠️  GUIA-DESPLEGUE.md no encontrado"
mv GUIA_RAPIDA_SUPABASE.md docs/deployment/ 2>/dev/null && echo "  ✅ GUIA_RAPIDA_SUPABASE.md" || echo "  ⚠️  GUIA_RAPIDA_SUPABASE.md no encontrado"

# Mover archivos de mantenimiento
echo "🔧 Moviendo guías de mantenimiento..."
mv MANTENER_SUPABASE_ACTIVO.md docs/maintenance/ 2>/dev/null && echo "  ✅ MANTENER_SUPABASE_ACTIVO.md" || echo "  ⚠️  MANTENER_SUPABASE_ACTIVO.md no encontrado"
mv FIX_WEBSOCKET_ERROR.md docs/maintenance/ 2>/dev/null && echo "  ✅ FIX_WEBSOCKET_ERROR.md" || echo "  ⚠️  FIX_WEBSOCKET_ERROR.md no encontrado"

# Mover archivos de troubleshooting
echo "🐛 Moviendo guías de troubleshooting..."
mv TROUBLESHOOTING-STORAGE.md docs/troubleshooting/ 2>/dev/null && echo "  ✅ TROUBLESHOOTING-STORAGE.md" || echo "  ⚠️  TROUBLESHOOTING-STORAGE.md no encontrado"
mv TROUBLESHOOTING_CONEXION.md docs/troubleshooting/ 2>/dev/null && echo "  ✅ TROUBLESHOOTING_CONEXION.md" || echo "  ⚠️  TROUBLESHOOTING_CONEXION.md no encontrado"
mv SOLUCION_CERTIFICADOS.md docs/troubleshooting/ 2>/dev/null && echo "  ✅ SOLUCION_CERTIFICADOS.md" || echo "  ⚠️  SOLUCION_CERTIFICADOS.md no encontrado"
mv SOLUCION_CERTIFICADOS_SSL.md docs/troubleshooting/ 2>/dev/null && echo "  ✅ SOLUCION_CERTIFICADOS_SSL.md" || echo "  ⚠️  SOLUCION_CERTIFICADOS_SSL.md no encontrado"

# Mover archivos de características
echo "✨ Moviendo documentación de características..."
mv EDICION_VARIANTES.md docs/features/ 2>/dev/null && echo "  ✅ EDICION_VARIANTES.md" || echo "  ⚠️  EDICION_VARIANTES.md no encontrado"
mv MEJORAS_MODAL_V2.md docs/features/ 2>/dev/null && echo "  ✅ MEJORAS_MODAL_V2.md" || echo "  ⚠️  MEJORAS_MODAL_V2.md no encontrado"
mv MULTIPLE_IMAGES.md docs/features/ 2>/dev/null && echo "  ✅ MULTIPLE_IMAGES.md" || echo "  ⚠️  MULTIPLE_IMAGES.md no encontrado"
mv OPTIMIZACIONES.md docs/features/ 2>/dev/null && echo "  ✅ OPTIMIZACIONES.md" || echo "  ⚠️  OPTIMIZACIONES.md no encontrado"
mv OPTIMIZACION_PRECARGA.md docs/features/ 2>/dev/null && echo "  ✅ OPTIMIZACION_PRECARGA.md" || echo "  ⚠️  OPTIMIZACION_PRECARGA.md no encontrado"
mv REBRANDING.md docs/features/ 2>/dev/null && echo "  ✅ REBRANDING.md" || echo "  ⚠️  REBRANDING.md no encontrado"
mv SISTEMA_ENTREGAS.md docs/features/ 2>/dev/null && echo "  ✅ SISTEMA_ENTREGAS.md" || echo "  ⚠️  SISTEMA_ENTREGAS.md no encontrado"
mv SIUUU_ANIMACION.md docs/features/ 2>/dev/null && echo "  ✅ SIUUU_ANIMACION.md" || echo "  ⚠️  SIUUU_ANIMACION.md no encontrado"

echo ""
echo "✅ Reestructuración completada!"
echo ""
echo "📂 Nueva estructura:"
echo "docs/"
echo "├── README.md"
echo "├── deployment/"
echo "│   ├── GUIA-DESPLEGUE.md"
echo "│   └── GUIA_RAPIDA_SUPABASE.md"
echo "├── maintenance/"
echo "│   ├── MANTENER_SUPABASE_ACTIVO.md"
echo "│   └── FIX_WEBSOCKET_ERROR.md"
echo "├── troubleshooting/"
echo "│   ├── TROUBLESHOOTING-STORAGE.md"
echo "│   ├── TROUBLESHOOTING_CONEXION.md"
echo "│   ├── SOLUCION_CERTIFICADOS.md"
echo "│   └── SOLUCION_CERTIFICADOS_SSL.md"
echo "└── features/"
echo "    ├── EDICION_VARIANTES.md"
echo "    ├── MEJORAS_MODAL_V2.md"
echo "    ├── MULTIPLE_IMAGES.md"
echo "    ├── OPTIMIZACIONES.md"
echo "    ├── OPTIMIZACION_PRECARGA.md"
echo "    ├── REBRANDING.md"
echo "    ├── SISTEMA_ENTREGAS.md"
echo "    └── SIUUU_ANIMACION.md"
echo ""
echo "🎉 ¡Listo! Ahora puedes hacer commit de los cambios:"
echo "   git add ."
echo "   git commit -m 'docs: reestructurar documentación en carpeta docs/'"
echo "   git push"
