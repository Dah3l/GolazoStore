# 🚀 Guía Completa de Despliegue - Golazo Store

Guía paso a paso para montar tu tienda online en **Cloudflare Pages** + **Supabase** desde cero.

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#1-requisitos-previos)
2. [Configurar Supabase](#2-configurar-supabase)
3. [Configurar el Proyecto Local](#3-configurar-el-proyecto-local)
4. [Desarrollo Local](#4-desarrollo-local)
5. [Desplegar en Cloudflare Pages](#5-desplegar-en-cloudflare-pages)
6. [Configuración Final de la Tienda](#6-configuración-final-de-la-tienda)
7. [Dominio Personalizado (Opcional)](#7-dominio-personalizado-opcional)
8. [Solución de Problemas](#8-solución-de-problemas)

---

## 1. Requisitos Previos

Antes de empezar necesitas tener:

| Requisito | Descripción | Enlace |
|-----------|-------------|--------|
| **Cuenta de GitHub** | Para alojar el código y conectar con Cloudflare | [github.com](https://github.com) |
| **Cuenta de Supabase** | Base de datos + autenticación + storage | [supabase.com](https://supabase.com) |
| **Cuenta de Cloudflare** | Para hosting gratuito | [cloudflare.com](https://cloudflare.com) |
| **Git instalado** | Para subir código a GitHub | [git-scm.com](https://git-scm.com) |
| **Node.js 18+** | Para ejecutar el proyecto localmente | [nodejs.org](https://nodejs.org) |

> 💡 **Todos los servicios tienen plan gratuito** más que suficiente para empezar.

---

## 2. Configurar Supabase

### 2.1 Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y haz clic en **"Start your project"**
2. Inicia sesión con GitHub
3. Haz clic en **"New Project"**
4. Completa el formulario:
   - **Organization**: Selecciona la tuya
   - **Name**: `golazo-store` (o el nombre que quieras)
   - **Database Password**: ⚠️ **GUÁRDALA BIEN**, la necesitarás después
   - **Region**: Selecciona la más cercana a tus clientes (ej: `US East`)
   - **Pricing Plan**: Free (gratis)
5. Haz clic en **"Create new project"** y espera ~2 minutos

### 2.2 Crear las Tablas de la Base de Datos

1. En el panel de Supabase, ve a **"SQL Editor"** (icono de base de datos en la barra lateral)
2. Haz clic en **"New query"**
3. **Copia y pega TODO el contenido del archivo `supabase-init.sql`** que viene en este proyecto
4. Haz clic en **"Run"** (o presiona `Ctrl+Enter`)

✅ Deberías ver un mensaje de éxito. Esto crea:
- Tabla `products` (camisetas)
- Tabla `product_variants` (jugadores, tallas, stock)
- Tabla `delivery_zones` (zonas de entrega)
- Tabla `business_settings` (datos del negocio)
- Tabla `orders` (historial de pedidos)
- Políticas de seguridad (RLS)
- Datos de ejemplo iniciales

### 2.3 Crear el Bucket de Storage (para imágenes)

1. En el panel, ve a **"Storage"** (icono de disco en la barra lateral)
2. Haz clic en **"New bucket"**
3. Configura:
   - **Name**: `products` (debe llamarse exactamente así)
   - **Public bucket**: ✅ **ACTIVADO** (para que las imágenes sean visibles)
4. Haz clic en **"Create bucket"**

### 2.4 Crear el Usuario Administrador

1. Ve a **"Authentication"** → **"Users"**
2. Haz clic en **"Add user"** → **"Create new user"**
3. Completa:
   - **Email**: tu email (ej: `admin@tienda.com`)
   - **Password**: una contraseña segura (mínimo 6 caracteres)
   - ❌ **NO marques** "Auto Confirm User" (o márcalo para saltarte el email de confirmación)
4. Haz clic en **"Create user"**

> 📝 **Guarda estas credenciales**. Las usarás para entrar al panel admin en `/admin/login`

### 2.5 Obtener las Credenciales del Proyecto

1. Ve a **"Settings"** (icono de engranaje) → **"API"**
2. Copia estos dos valores:
   - **Project URL**: algo como `https://abcdefg.supabase.co`
   - **anon public key**: una cadena larga que empieza por `eyJ...`

> ⚠️ **IMPORTANTE**: Usa la clave `anon` (pública), NO la `service_role` (secreta).

---

## 3. Configurar el Proyecto Local

### 3.1 Clonar o Descargar el Proyecto

Si tienes el proyecto en GitHub:
```bash
git clone https://github.com/TU_USUARIO/golazo-store.git
cd golazo-store
```

Si no, simplemente descarga los archivos y colócalos en una carpeta.

### 3.2 Instalar Dependencias

```bash
npm install
```

### 3.3 Crear Archivo de Variables de Entorno

Crea un archivo llamado **`.env`** en la raíz del proyecto con este contenido:

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Reemplaza los valores con los que copiaste en el paso 2.5.

> ⚠️ **NUNCA subas el archivo `.env` a GitHub**. Ya está incluido en `.gitignore`.

### 3.4 Verificar que Funciona Localmente

```bash
npm run dev
```

Abre `http://localhost:5173` en tu navegador. Deberías ver la tienda.

> Si ves errores de conexión, verifica que las credenciales de Supabase estén bien en el `.env`.

---

## 4. Desarrollo Local

### Comandos útiles:

```bash
# Servidor de desarrollo (con hot reload)
npm run dev

# Compilar para producción (verificar errores)
npm run build

# Verificar tipos TypeScript
npm run typecheck
```

### Estructura del proyecto:

```
golazo-store/
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── Header.tsx    # Barra superior con carrito
│   │   ├── Hero.tsx      # Sección de bienvenida
│   │   ├── Catalog.tsx   # Catálogo con filtros
│   │   ├── ProductCard.tsx    # Tarjeta de producto
│   │   ├── ProductModal.tsx   # Modal de selección
│   │   ├── Cart.tsx      # Carrito lateral
│   │   ├── OrderForm.tsx # Formulario de pedido
│   │   ├── InfoSection.tsx    # Info y FAQ
│   │   ├── Footer.tsx    # Pie de página
│   │   └── Onboarding.tsx     # Tutorial inicial
│   ├── context/          # Estados globales
│   │   ├── CartContext.tsx    # Carrito (localStorage)
│   │   └── BusinessContext.tsx # Configuración
│   ├── lib/
│   │   └── supabase.ts   # Cliente Supabase
│   ├── pages/
│   │   ├── Home.tsx      # Página principal
│   │   ├── AdminLogin.tsx     # Login admin
│   │   └── AdminDashboard.tsx # Panel admin
│   ├── types/
│   │   └── index.ts      # Tipos TypeScript
│   ├── App.tsx           # Router principal
│   ├── main.tsx          # Punto de entrada
│   └── index.css         # Estilos globales
├── public/               # Archivos estáticos
├── supabase-init.sql     # Script SQL para Supabase
├── .env                  # Variables de entorno (NO subir)
├── package.json
└── vite.config.js
```

---

## 5. Desplegar en Cloudflare Pages

### 5.1 Subir el Proyecto a GitHub

Si aún no lo has hecho:

```bash
# Inicializar repositorio (si es nuevo)
git init
git add .
git commit -m "Initial commit"

# Conectar con GitHub (crea un repo vacío primero en github.com)
git remote add origin https://github.com/TU_USUARIO/golazo-store.git
git branch -M main
git push -u origin main
```

### 5.2 Crear Proyecto en Cloudflare Pages

1. Ve a [pages.cloudflare.com](https://pages.cloudflare.com)
2. Inicia sesión (o crea cuenta gratis)
3. Haz clic en **"Create a project"**
4. Selecciona **"Connect to Git"**
5. Autoriza Cloudflare para acceder a tu GitHub
6. Selecciona el repositorio `golazo-store`

### 5.3 Configurar el Build

En la pantalla de configuración del build, completa:

| Campo | Valor |
|-------|-------|
| **Framework preset** | `Vite` (o "None") |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` (dejar por defecto) |

### 5.4 Agregar Variables de Entorno en Cloudflare

⚠️ **MUY IMPORTANTE**: Antes de hacer el primer deploy, agrega las variables:

1. En la misma pantalla de configuración, busca la sección **"Environment variables"**
2. Agrega estas dos variables:

| Variable | Valor |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://TU-PROYECTO.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIs...` (la anon key) |

3. Haz clic en **"Save and Deploy"**

> 💡 **Tip**: Cloudflare tarda ~2 minutos en hacer el primer deploy.

### 5.5 Verificar el Deploy

1. Espera a que el deploy termine
2. Cloudflare te dará una URL como: `https://golazo-store.pages.dev`
3. Ábrela y verifica que la tienda carga correctamente

### 5.6 Deploys Automáticos

A partir de ahora, **cada vez que hagas push a GitHub**, Cloudflare hará un deploy automáticamente. ¡No tienes que hacer nada más!

```bash
git add .
git commit -m "Actualización de productos"
git push
# → Cloudflare hace el deploy solo ✨
```

---

## 6. Configuración Final de la Tienda

Una vez desplegado, configura tu tienda desde el panel admin:

### 6.1 Acceder al Panel Admin

1. Ve a `https://TU-DOMINIO.pages.dev/admin/login`
2. Inicia sesión con el email y contraseña que creaste en el paso 2.4

### 6.2 Configurar Datos del Negocio (Tab "Config")

1. Ve al tab **"Config"**
2. Completa:
   - **Nombre del negocio**: El nombre de tu tienda
   - **WhatsApp**: Tu número SIN espacios, SIN + (ej: `5351234567`)
   - **Email**: Tu email de contacto
   - **Dirección**: Tu ubicación
   - **Descripción**: Texto para el hero y footer
   - **Redes sociales**: URLs de Instagram, Facebook, Telegram
3. Haz clic en **"Guardar Configuración"**

### 6.3 Agregar Zonas de Entrega (Tab "Envíos")

1. Ve al tab **"Envíos"**
2. Haz clic en **"Nueva Zona"**
3. Agrega las zonas donde haces entregas con su precio en CUP:
   - Ej: `La Habana` - `200`
   - Ej: `Provincias cercanas` - `350`
   - Ej: `Resto del país` - `500`

### 6.4 Agregar Productos (Tab "Productos")

1. Ve al tab **"Productos"**
2. Haz clic en **"Nuevo Producto"**
3. Completa el formulario:
   - **Nombre**: Ej: `Camiseta Local Real Madrid 2024`
   - **Equipo**: Ej: `Real Madrid`
   - **Precio**: Precio actual en USD (si hay oferta, el precio con descuento)
   - **Precio Original**: Solo si hay oferta (el precio anterior tachado)
   - **Imagen**: Sube la imagen o pega una URL
   - **Por encargo**: Marca si es preventa
   - **Días de entrega**: Si es por encargo, cuántos días tarda
4. **Agrega variantes** (jugadores disponibles):
   - **Jugador**: Nombre del jugador
   - **Tallas**: Separadas por coma (ej: `S,M,L,XL`)
   - **Stock**: Cantidad disponible
   - Haz clic en **"+"** para agregar cada variante
5. Haz clic en **"Crear Producto"**

> 💡 **Tip**: Puedes agregar todas las variantes que quieras (Bellingham, Vinicius, Mbappé, etc.)

### 6.5 ¡Tu tienda está lista!

Ahora tus clientes pueden:
1. Ver el catálogo
2. Filtrar por equipo, talla, stock/ofertas
3. Elegir jugador y talla
4. Agregar al carrito
5. Pedir por WhatsApp con toda la info lista

---

## 7. Dominio Personalizado (Opcional)

Si quieres usar tu propio dominio (ej: `tienda.com`):

### 7.1 En Cloudflare

1. Ve a tu proyecto en Cloudflare Pages
2. Tab **"Custom domains"** → **"Set up a custom domain"**
3. Escribe tu dominio: `tienda.com`
4. Cloudflare te dará instrucciones para configurar los DNS

### 7.2 Configurar DNS

En el panel de tu registrador de dominio (o en Cloudflare si lo tienes ahí):

| Tipo | Nombre | Contenido |
|------|--------|-----------|
| CNAME | `@` | `TU-PROYECTO.pages.dev` |
| CNAME | `www` | `TU-PROYECTO.pages.dev` |

> 💡 Si tu dominio está en Cloudflare, los DNS se configuran automáticamente.

### 7.3 SSL/HTTPS

Cloudflare genera el certificado SSL automáticamente. No tienes que hacer nada.

---

## 8. Solución de Problemas

### ❌ "La tienda carga pero no muestra productos"

**Causa**: Las variables de entorno no están configuradas en Cloudflare.

**Solución**:
1. Ve a tu proyecto en Cloudflare Pages
2. **"Settings"** → **"Environment variables"**
3. Agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
4. Haz un nuevo deploy: **"Deployments"** → último deploy → **"Retry deployment"**

### ❌ "Error al iniciar sesión en el admin"

**Causa**: El usuario no fue creado en Supabase o las credenciales son incorrectas.

**Solución**:
1. Ve a Supabase → **"Authentication"** → **"Users"**
2. Verifica que el email existe
3. Si no, créalo de nuevo con **"Create new user"**
4. Asegúrate de marcar **"Auto Confirm User"**

### ❌ "Las imágenes no se suben"

**Causa**: El bucket de storage no existe o no es público.

**Solución**:
1. Ve a Supabase → **"Storage"**
2. Verifica que existe un bucket llamado `products`
3. Asegúrate de que está marcado como **público**
4. Si no existe, créalo con ese nombre exacto

### ❌ "WhatsApp no abre el chat correcto"

**Causa**: El número de WhatsApp está mal formateado.

**Solución**:
1. Ve al panel admin → **"Config"**
2. El número debe estar SIN espacios, SIN +, SIN guiones
3. Correcto: `5351234567`
4. Incorrecto: `+53 5123-4567`

### ❌ "El build falla en Cloudflare"

**Causa**: Error en el código o dependencias faltantes.

**Solución**:
1. Prueba localmente: `npm run build`
2. Si falla localmente, arregla el error primero
3. Haz push de la corrección
4. Cloudflare hará el deploy automáticamente

### ❌ "Los productos no se guardan"

**Causa**: Las políticas RLS están bloqueando la escritura.

**Solución**:
1. Verifica que ejecutaste el script `supabase-init.sql` completo
2. Ve a Supabase → **"Authentication"** → confirma que el usuario admin existe
3. Verifica que las políticas RLS están activas en las tablas

### ❌ "La página se ve rota / sin estilos"

**Causa**: El build output no es correcto.

**Solución**:
1. Verifica en Cloudflare que el **"Build output directory"** sea `dist`
2. Verifica que el **"Build command"** sea `npm run build`

---

## 📞 Soporte Adicional

Si tienes problemas que no están en esta guía:

1. Revisa la consola del navegador (F12) para ver errores
2. Verifica los logs del deploy en Cloudflare Pages
3. Revisa los logs en Supabase (Dashboard → Logs)

---

## 🎯 Checklist Final

Antes de lanzar tu tienda, verifica:

- [ ] Proyecto de Supabase creado
- [ ] Script SQL ejecutado (todas las tablas creadas)
- [ ] Bucket `products` creado y público
- [ ] Usuario admin creado en Supabase Auth
- [ ] Variables de entorno configuradas localmente (`.env`)
- [ ] Variables de entorno configuradas en Cloudflare Pages
- [ ] Proyecto subido a GitHub
- [ ] Deploy exitoso en Cloudflare Pages
- [ ] Configuración del negocio completada (admin → Config)
- [ ] Zonas de entrega agregadas (admin → Envíos)
- [ ] Al menos un producto de prueba agregado (admin → Productos)
- [ ] WhatsApp probado (hacer un pedido de prueba)
- [ ] Tutorial de onboarding verificado (borrar localStorage para verlo)
- [ ] (Opcional) Dominio personalizado configurado

---

## 🔄 Actualizaciones Futuras

Para actualizar tu tienda:

```bash
# Hacer cambios en el código
git add .
git commit -m "Descripción del cambio"
git push
# → Cloudflare despliega automáticamente
```

### Hacer backup de la base de datos:

1. Ve a Supabase → **"Database"** → **"Backups"**
2. Puedes descargar un backup Point-in-Time Recovery (PITR)
3. Los planes gratuitos incluyen 7 días de backups automáticos

---

## 📝 Notas Importantes

- **Plan gratuito de Supabase**: 500MB de base de datos, 1GB de storage, 50,000 usuarios activos mensuales
- **Plan gratuito de Cloudflare Pages**: Deploy ilimitados, ancho de banda ilimitado, SSL incluido
- **El carrito se guarda en localStorage** del navegador del cliente
- **Los pedidos se envían por WhatsApp**, no se guardan en la base de datos (puedes implementar esto después)
- **Las imágenes se almacenan en Supabase Storage** (bucket `products`)

---

**¡Felicidades! Tu tienda online está funcionando. 🎉**
