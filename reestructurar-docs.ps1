# Script para reestructurar la documentación de Golazo Store (Windows PowerShell)
# Ejecutar desde la raíz del proyecto: .\reestructurar-docs.ps1

Write-Host "🚀 Iniciando reestructuración de documentación..." -ForegroundColor Green

# Crear estructura de carpetas
Write-Host "`n📁 Creando estructura de carpetas..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "docs\deployment" | Out-Null
New-Item -ItemType Directory -Force -Path "docs\maintenance" | Out-Null
New-Item -ItemType Directory -Force -Path "docs\troubleshooting" | Out-Null
New-Item -ItemType Directory -Force -Path "docs\features" | Out-Null

# Función para mover archivos
function Move-DocFile {
    param (
        [string]$Source,
        [string]$Destination
    )
    
    if (Test-Path $Source) {
        Move-Item -Path $Source -Destination $Destination -Force
        Write-Host "  ✅ $Source" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  $Source no encontrado" -ForegroundColor Yellow
    }
}

# Mover archivos de despliegue
Write-Host "`n📦 Moviendo guías de despliegue..." -ForegroundColor Cyan
Move-DocFile "GUIA-DESPLEGUE.md" "docs\deployment\GUIA-DESPLEGUE.md"
Move-DocFile "GUIA_RAPIDA_SUPABASE.md" "docs\deployment\GUIA_RAPIDA_SUPABASE.md"

# Mover archivos de mantenimiento
Write-Host "`n🔧 Moviendo guías de mantenimiento..." -ForegroundColor Cyan
Move-DocFile "MANTENER_SUPABASE_ACTIVO.md" "docs\maintenance\MANTENER_SUPABASE_ACTIVO.md"
Move-DocFile "FIX_WEBSOCKET_ERROR.md" "docs\maintenance\FIX_WEBSOCKET_ERROR.md"

# Mover archivos de troubleshooting
Write-Host "`n🐛 Moviendo guías de troubleshooting..." -ForegroundColor Cyan
Move-DocFile "TROUBLESHOOTING-STORAGE.md" "docs\troubleshooting\TROUBLESHOOTING-STORAGE.md"
Move-DocFile "TROUBLESHOOTING_CONEXION.md" "docs\troubleshooting\TROUBLESHOOTING_CONEXION.md"
Move-DocFile "SOLUCION_CERTIFICADOS.md" "docs\troubleshooting\SOLUCION_CERTIFICADOS.md"
Move-DocFile "SOLUCION_CERTIFICADOS_SSL.md" "docs\troubleshooting\SOLUCION_CERTIFICADOS_SSL.md"

# Mover archivos de características
Write-Host "`n✨ Moviendo documentación de características..." -ForegroundColor Cyan
Move-DocFile "EDICION_VARIANTES.md" "docs\features\EDICION_VARIANTES.md"
Move-DocFile "MEJORAS_MODAL_V2.md" "docs\features\MEJORAS_MODAL_V2.md"
Move-DocFile "MULTIPLE_IMAGES.md" "docs\features\MULTIPLE_IMAGES.md"
Move-DocFile "OPTIMIZACIONES.md" "docs\features\OPTIMIZACIONES.md"
Move-DocFile "OPTIMIZACION_PRECARGA.md" "docs\features\OPTIMIZACION_PRECARGA.md"
Move-DocFile "REBRANDING.md" "docs\features\REBRANDING.md"
Move-DocFile "SISTEMA_ENTREGAS.md" "docs\features\SISTEMA_ENTREGAS.md"
Move-DocFile "SIUUU_ANIMACION.md" "docs\features\SIUUU_ANIMACION.md"

Write-Host "`n✅ Reestructuración completada!" -ForegroundColor Green
Write-Host "`n📂 Nueva estructura:" -ForegroundColor Cyan
Write-Host "docs/"
Write-Host "├── README.md"
Write-Host "├── deployment/"
Write-Host "│   ├── GUIA-DESPLEGUE.md"
Write-Host "│   └── GUIA_RAPIDA_SUPABASE.md"
Write-Host "├── maintenance/"
Write-Host "│   ├── MANTENER_SUPABASE_ACTIVO.md"
Write-Host "│   └── FIX_WEBSOCKET_ERROR.md"
Write-Host "├── troubleshooting/"
Write-Host "│   ├── TROUBLESHOOTING-STORAGE.md"
Write-Host "│   ├── TROUBLESHOOTING_CONEXION.md"
Write-Host "│   ├── SOLUCION_CERTIFICADOS.md"
Write-Host "│   └── SOLUCION_CERTIFICADOS_SSL.md"
Write-Host "└── features/"
Write-Host "    ├── EDICION_VARIANTES.md"
Write-Host "    ├── MEJORAS_MODAL_V2.md"
Write-Host "    ├── MULTIPLE_IMAGES.md"
Write-Host "    ├── OPTIMIZACIONES.md"
Write-Host "    ├── OPTIMIZACION_PRECARGA.md"
Write-Host "    ├── REBRANDING.md"
Write-Host "    ├── SISTEMA_ENTREGAS.md"
Write-Host "    └── SIUUU_ANIMACION.md"

Write-Host "`n🎉 ¡Listo! Ahora puedes hacer commit de los cambios:" -ForegroundColor Green
Write-Host "   git add ." -ForegroundColor Yellow
Write-Host "   git commit -m 'docs: reestructurar documentación en carpeta docs/'" -ForegroundColor Yellow
Write-Host "   git push" -ForegroundColor Yellow
