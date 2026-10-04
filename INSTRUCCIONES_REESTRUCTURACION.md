# 📋 Instrucciones para Reestructurar la Documentación

## 🎯 Objetivo

Mover todos los archivos `.md` (excepto `README.md`) a una carpeta organizada `docs/` con subcarpetas por categoría.

---

## 🚀 Opción 1: Usar Script Automático (Recomendado)

### En Linux/Mac:

```bash
# Dar permisos de ejecución
chmod +x reestructurar-docs.sh

# Ejecutar el script
bash reestructurar-docs.sh
```

### En Windows (PowerShell):

```powershell
# Ejecutar el script
.\reestructurar-docs.ps1
```

**Nota**: Si PowerShell bloquea la ejecución, ejecuta primero:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 🛠️ Opción 2: Mover Manualmente

Si prefieres hacerlo manualmente, sigue estos pasos:

### 1. Crear la estructura de carpetas

```bash
# Linux/Mac
mkdir -p docs/deployment
mkdir -p docs/maintenance
mkdir -p docs/troubleshooting
mkdir -p docs/features
```

```powershell
# Windows PowerShell
New-Item -ItemType Directory -Force -Path "docs\deployment"
New-Item -ItemType Directory -Force -Path "docs\maintenance"
New-Item -ItemType Directory -Force -Path "docs\troubleshooting"
New-Item -ItemType Directory -Force -Path "docs\features"
```

### 2. Mover los archivos

#### 📦 Despliegue (`docs/deployment/`)
```bash
mv GUIA-DESPLEGUE.md docs/deployment/
mv GUIA_RAPIDA_SUPABASE.md docs/deployment/
```

#### 🔧 Mantenimiento (`docs/maintenance/`)
```bash
mv MANTENER_SUPABASE_ACTIVO.md docs/maintenance/
mv FIX_WEBSOCKET_ERROR.md docs/maintenance/
```

#### 🐛 Troubleshooting (`docs/troubleshooting/`)
```bash
mv TROUBLESHOOTING-STORAGE.md docs/troubleshooting/
mv TROUBLESHOOTING_CONEXION.md docs/troubleshooting/
mv SOLUCION_CERTIFICADOS.md docs/troubleshooting/
mv SOLUCION_CERTIFICADOS_SSL.md docs/troubleshooting/
```

#### ✨ Características (`docs/features/`)
```bash
mv EDICION_VARIANTES.md docs/features/
mv MEJORAS_MODAL_V2.md docs/features/
mv MULTIPLE_IMAGES.md docs/features/
mv OPTIMIZACIONES.md docs/features/
mv OPTIMIZACION_PRECARGA.md docs/features/
mv REBRANDING.md docs/features/
mv SISTEMA_ENTREGAS.md docs/features/
mv SIUUU_ANIMACION.md docs/features/
```

---

## 📊 Estructura Final

```
golazo-store/
├── docs/                          # 📚 Documentación organizada
│   ├── README.md                  # Índice de documentación
│   ├── deployment/                # 🚀 Guías de despliegue
│   │   ├── GUIA-DESPLEGUE.md
│   │   └── GUIA_RAPIDA_SUPABASE.md
│   ├── maintenance/               # 🔧 Mantenimiento
│   │   ├── MANTENER_SUPABASE_ACTIVO.md
│   │   └── FIX_WEBSOCKET_ERROR.md
│   ├── troubleshooting/           # 🐛 Solución de problemas
│   │   ├── TROUBLESHOOTING-STORAGE.md
│   │   ├── TROUBLESHOOTING_CONEXION.md
│   │   ├── SOLUCION_CERTIFICADOS.md
│   │   └── SOLUCION_CERTIFICADOS_SSL.md
│   └── features/                  # ✨ Características
│       ├── EDICION_VARIANTES.md
│       ├── MEJORAS_MODAL_V2.md
│       ├── MULTIPLE_IMAGES.md
│       ├── OPTIMIZACIONES.md
│       ├── OPTIMIZACION_PRECARGA.md
│       ├── REBRANDING.md
│       ├── SISTEMA_ENTREGAS.md
│       └── SIUUU_ANIMACION.md
├── src/                           # 💻 Código fuente
├── README.md                      # 📖 README principal
└── ...
```

---

## ✅ Verificar la Reestructuración

Después de mover los archivos, verifica que todo esté en su lugar:

```bash
# Listar todos los archivos .md en docs/
find docs -name "*.md" -type f
```

Deberías ver 17 archivos (1 README + 16 archivos de documentación).

---

## 📝 Hacer Commit de los Cambios

```bash
# Agregar todos los cambios
git add .

# Hacer commit
git commit -m "docs: reestructurar documentación en carpeta docs/

- Crear estructura organizada en docs/
- Mover guías de despliegue a docs/deployment/
- Mover guías de mantenimiento a docs/maintenance/
- Mover troubleshooting a docs/troubleshooting/
- Mover documentación de features a docs/features/
- Actualizar README.md con nueva estructura
- Crear índice de documentación en docs/README.md"

# Push a GitHub
git push
```

---

## 🔗 Actualizar Enlaces en la Documentación

Después de mover los archivos, algunos enlaces internos pueden estar rotos. El script ya crea un `docs/README.md` con los enlaces correctos, pero si necesitas actualizar otros archivos:

### Ejemplo de enlace relativo:

**Antes** (en la raíz):
```markdown
[Guía de Despliegue](./GUIA-DESPLEGUE.md)
```

**Después** (en `docs/README.md`):
```markdown
[Guía de Despliegue](./deployment/GUIA-DESPLEGUE.md)
```

---

## 🎯 Beneficios de la Reestructuración

✅ **Organización clara**: Documentación agrupada por categoría  
✅ **Fácil navegación**: Índice centralizado en `docs/README.md`  
✅ **Escalabilidad**: Fácil agregar nuevas categorías  
✅ **Profesional**: Estructura estándar de proyectos  
✅ **Mantenible**: Fácil encontrar documentación específica  

---

## 🐛 Solución de Problemas

### Error: "Permission denied" (Linux/Mac)
```bash
chmod +x reestructurar-docs.sh
```

### Error: "cannot be loaded because running scripts is disabled" (Windows)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error: "No such file or directory"
Verifica que estás en la raíz del proyecto:
```bash
pwd  # Debería mostrar la ruta del proyecto
ls   # Deberías ver los archivos .md
```

---

## 📞 Soporte

Si tienes problemas con la reestructuración:

1. Verifica que estás en la raíz del proyecto
2. Asegúrate de que los archivos `.md` existen
3. Revisa los permisos de los scripts
4. Consulta la documentación en `docs/README.md`

---

**¡Listo! Tu documentación ahora está perfectamente organizada** 🎉
