# ⚽ Golazo Store

Tienda online de camisetas de fútbol con pedidos vía WhatsApp.

![Golazo Store](https://yyfpiyjwtrrvrsbmtgog.supabase.co/storage/v1/object/public/products/Logo/SAVE_20260927_150213.jpg)

---

## 🚀 Características Principales

- 🛒 **Carrito de compras** con persistencia en localStorage
- 💬 **Pedidos por WhatsApp** con mensaje prearmado
- 🖼️ **Galería de imágenes** con carrusel y lightbox
- 🔍 **Búsqueda y filtros** avanzados
- 📍 **Sistema de entregas** jerárquico por localidades
- 👕 **Gestión de variantes** (jugadores, tallas, stock)
- 🎨 **Animación SIUUU** de CR7 al agregar al carrito
- 📱 **Diseño responsive** optimizado para móvil
- 🔐 **Panel de administración** completo

---

## 🛠️ Stack Tecnológico

- **Frontend**: React + TypeScript + Vite
- **Estilos**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Hosting**: Cloudflare Pages
- **Pagos**: WhatsApp (cierre de venta)

---

## 📚 Documentación

Toda la documentación está organizada en la carpeta [`docs/`](./docs/README.md):

### 🚀 Despliegue
- [Guía Completa de Despliegue](./docs/deployment/GUIA-DESPLEGUE.md)
- [Guía Rápida Supabase](./docs/deployment/GUIA_RAPIDA_SUPABASE.md)

### 🔧 Mantenimiento
- [Mantener Supabase Activo](./docs/maintenance/MANTENER_SUPABASE_ACTIVO.md)
- [Fix Error WebSocket](./docs/maintenance/FIX_WEBSOCKET_ERROR.md)

### 🐛 Troubleshooting
- [Troubleshooting Storage](./docs/troubleshooting/TROUBLESHOOTING-STORAGE.md)
- [Troubleshooting Conexión](./docs/troubleshooting/TROUBLESHOOTING_CONEXION.md)
- [Solución Certificados](./docs/troubleshooting/SOLUCION_CERTIFICADOS.md)

### ✨ Características
- [Edición de Variantes](./docs/features/EDICION_VARIANTES.md)
- [Múltiples Imágenes](./docs/features/MULTIPLE_IMAGES.md)
- [Sistema de Entregas](./docs/features/SISTEMA_ENTREGAS.md)
- [Animación SIUUU](./docs/features/SIUUU_ANIMACION.md)
- [Y más...](./docs/features/)

---

## 🏁 Inicio Rápido

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/golazo-store.git
cd golazo-store
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### 4. Configurar Supabase
Ejecuta los scripts SQL en orden:
```bash
# 1. Estructura base
supabase-init.sql

# 2. Políticas de storage
supabase-storage-policies.sql

# 3. Sistema de imágenes múltiples
supabase-multiple-images.sql

# 4. Sistema de entregas
supabase-delivery-system.sql
supabase-delivery-data.sql
```

### 5. Iniciar servidor de desarrollo
```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Producción
npm run build        # Compilar para producción
npm run preview      # Previsualizar build de producción

# Calidad de código
npm run lint         # Ejecutar ESLint
```

---

## 🗂️ Estructura del Proyecto

```
golazo-store/
├── src/
│   ├── components/        # Componentes React
│   │   ├── Cart.tsx
│   │   ├── Catalog.tsx
│   │   ├── Header.tsx
│   │   ├── ProductModal.tsx
│   │   └── ...
│   ├── context/           # Contextos globales
│   │   ├── CartContext.tsx
│   │   └── BusinessContext.tsx
│   ├── hooks/             # Hooks personalizados
│   │   ├── useScrollPosition.ts
│   │   └── useSiuuuSound.ts
│   ├── lib/               # Utilidades
│   │   └── supabase.ts
│   ├── pages/             # Páginas
│   │   ├── Home.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── AdminLogin.tsx
│   ├── types/             # Tipos TypeScript
│   └── App.tsx
├── docs/                  # Documentación
│   ├── deployment/
│   ├── maintenance/
│   ├── troubleshooting/
│   └── features/
├── cloudflare-worker/     # Worker para mantener Supabase activo
├── .github/workflows/     # GitHub Actions
├── *.sql                  # Scripts de base de datos
└── README.md
```

---

## 🔐 Panel de Administración

Accede al panel admin en `/admin/login`:

- **Gestión de productos**: Crear, editar, eliminar productos
- **Gestión de variantes**: Editar jugadores, tallas y stock
- **Gestión de imágenes**: Subir múltiples imágenes por producto
- **Sistema de entregas**: Configurar localidades y puntos de entrega
- **Configuración**: Datos del negocio, WhatsApp, redes sociales

---

## 🎨 Características Destacadas

### 🛒 Carrito Inteligente
- Persistencia en localStorage
- Cálculo automático de totales
- Validación de stock

### 💬 Pedidos por WhatsApp
- Mensaje prearmado con todos los detalles
- Soporte para WhatsApp Business
- Detección automática de dispositivo

### 🖼️ Galería de Imágenes
- Carrusel interactivo
- Lightbox a pantalla completa
- Soporte para múltiples imágenes

### 📍 Sistema de Entregas
- Localidades con puntos de entrega
- Precios específicos por zona
- Cálculo automático de envío

### 🎉 Animación SIUUU
- Animación épica al completar onboarding
- Sonido de CR7 al agregar al carrito
- Precarga optimizada de recursos

---

## 🚀 Despliegue

### Cloudflare Pages (Recomendado)

1. Sube el código a GitHub
2. Conecta el repositorio en Cloudflare Pages
3. Configura las variables de entorno
4. ¡Listo! Deploy automático en cada push

Ver [Guía Completa de Despliegue](./docs/deployment/GUIA-DESPLEGUE.md)

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es privado y propiedad de Golazo Store.

---

## 📞 Contacto

- **WhatsApp**: +53 XXXXXXXX
- **Email**: contacto@golazostore.com
- **Instagram**: [@golazostore](https://instagram.com/golazostore)

---

## 🙏 Agradecimientos

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Cloudflare](https://cloudflare.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Hecho con ❤️ para los amantes del fútbol**

⚽ **Golazo Store** - Las mejores camisetas de fútbol
