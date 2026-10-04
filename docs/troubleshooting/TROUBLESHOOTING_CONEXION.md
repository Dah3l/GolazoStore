# 🔧 Solución de Problemas de Conexión en Cuba

## ❌ Error: PR_CONNECT_RESET_ERROR (Firefox) / ERR_CONNECTION_RESET (Chrome)

### Descripción del Problema
Usuarios en Cuba reportan errores de conexión segura al acceder al sitio, especialmente en:
- Firefox (PR_CONNECT_RESET_ERROR)
- Chrome/Android (ERR_CONNECTION_RESET)
- Navegadores nativos de Android

**Síntoma clave**: El sitio funciona perfectamente con VPN activada.

---

## 🔍 Causa del Problema

**Problema de infraestructura de red en Cuba**, NO del código de la aplicación.

### Posibles causas:
1. **Bloqueo/interferencia del ISP (ETECSA)** con certificados SSL de Cloudflare
2. **Problemas de DNS** en la red de ETECSA
3. **Filtrado de tráfico HTTPS** en ciertos horarios o regiones
4. **Problemas con el certificado SSL** de Cloudflare Pages en Cuba

### Evidencia:
- ✅ Funciona con VPN (confirma bloqueo de red)
- ✅ Funciona en otros países
- ✅ Afecta múltiples navegadores
- ✅ El código de la aplicación funciona correctamente

---

## 🛠️ Soluciones para el Administrador

### 1. Verificar Configuración SSL en Cloudflare

#### Paso 1: Acceder a Cloudflare
1. Ve a [dash.cloudflare.com](https://dash.cloudflare.com)
2. Selecciona tu proyecto de Cloudflare Pages

#### Paso 2: Verificar SSL/TLS
1. Ve a **SSL/TLS** → **Overview**
2. Verifica que el modo esté en **"Full"** o **"Full (strict)"**
3. NO debe estar en "Flexible"

#### Paso 3: Verificar Certificado
1. Ve a **SSL/TLS** → **Edge Certificates**
2. Verifica que el certificado esté **"Active"**
3. Si no está activo, espera 5-10 minutos o renuévalo

#### Paso 4: Forzar HTTPS
1. Ve a **SSL/TLS** → **Edge Certificates**
2. Activa **"Always Use HTTPS"**
3. Activa **"Automatic HTTPS Rewrites"**

### 2. Configurar Reglas de Página

1. Ve a **Rules** → **Page Rules**
2. Crea una nueva regla:
   - **URL**: `*tudominio.com/*`
   - **Configuración**: 
     - **Always Use HTTPS**: ON
     - **Security Level**: Medium
     - **Cache Level**: Standard
   - **Estado**: Active

### 3. Usar Dominio Personalizado (Recomendado)

Los dominios `*.pages.dev` a veces tienen más problemas en Cuba.

#### Opción A: Dominio .com
1. Compra un dominio en Namecheap, GoDaddy, etc.
2. Agrégalo a Cloudflare Pages:
   - **Custom domains** → **Set up a custom domain**
   - Sigue las instrucciones para cambiar DNS
3. Espera 24-48 horas para propagación DNS

#### Opción B: Dominio .cu (si estás en Cuba)
1. Registra un dominio .cu en CENIAI
2. Configúralo en Cloudflare Pages
3. Ventaja: Mejor routing dentro de Cuba

### 4. Migrar a Netlify (Alternativa)

Si Cloudflare sigue dando problemas:

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**Ventajas de Netlify**:
- A veces funciona mejor en Cuba
- SSL automático
- CDN global

### 5. Migrar a Vercel (Otra Alternativa)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Ventajas de Vercel**:
- Excelente rendimiento
- SSL automático
- Buena conectividad desde Cuba

---

## 📋 Soluciones para Usuarios en Cuba

### Método 1: Usar VPN (Más Efectivo)

#### Apps VPN Recomendadas:
1. **Psiphon** (Gratis)
   - Download: [psiphon.ca](https://psiphon.ca)
   - Fácil de usar
   - Funciona bien en Cuba

2. **Turbo VPN** (Gratis)
   - Download: Play Store
   - Rápido y estable

3. **Lantern** (Gratis)
   - Download: [getlantern.org](https://getlantern.org)
   - Diseñado para países con censura

4. **Opera Browser** (VPN Integrada)
   - Download: Play Store
   - VPN gratuita integrada
   - No necesita app adicional

#### Cómo usar:
1. Descarga e instala la app VPN
2. Activa la VPN
3. Conéctate a un servidor (EEUU, España, etc.)
4. Abre el navegador y accede al sitio

### Método 2: Cambiar DNS

#### DNS de Google:
- **DNS 1**: `8.8.8.8`
- **DNS 2**: `8.8.4.4`

#### DNS de Cloudflare:
- **DNS 1**: `1.1.1.1`
- **DNS 2**: `1.0.0.1`

#### Cómo cambiar DNS en Android:
1. Ve a **Configuración** → **Red e Internet**
2. Toca **DNS privado**
3. Selecciona **Nombre de host del proveedor de DNS privado**
4. Ingresa: `dns.google` o `1dot1dot1dot1.cloudflare-dns.com`
5. Guarda y reinicia el navegador

#### Cómo cambiar DNS en Windows:
1. Panel de Control → Redes e Internet → Centro de redes
2. Cambia la configuración del adaptador
3. Click derecho en tu conexión → Propiedades
4. Selecciona **Protocolo de Internet versión 4 (TCP/IPv4)**
5. Click en **Propiedades**
6. Selecciona **Usar las siguientes direcciones de DNS**
7. Ingresa los DNS de Google o Cloudflare
8. Aceptar y reiniciar

### Método 3: Usar Opera Browser

1. Descarga **Opera** desde Play Store
2. Abre Opera
3. Ve a **Configuración** → **Privacidad**
4. Activa **VPN**
5. Navega normalmente (VPN activada automáticamente)

### Método 4: Usar Datos Móviles

A veces funciona mejor con datos móviles que con WiFi:
1. Desactiva WiFi
2. Activa datos móviles
3. Intenta acceder al sitio
4. Si funciona, considera usar solo datos móviles para compras

### Método 5: Horarios de Menor Congestión

Intenta acceder en estos horarios:
- **Madrugada**: 1:00 AM - 6:00 AM
- **Mediodía**: 12:00 PM - 2:00 PM

En estos horarios la red está menos congestionada y hay menos filtrado.

---

## 🧪 Diagnóstico Avanzado

### Test 1: Verificar SSL
Usa estas herramientas online para verificar el certificado SSL:
- [SSL Labs](https://www.ssllabs.com/ssltest/)
- [Why No Padlock](https://www.whynopadlock.com/)

### Test 2: Verificar DNS
```bash
# En terminal (Linux/Mac)
nslookup tudominio.com

# Debería mostrar las IPs de Cloudflare
```

### Test 3: Verificar Conectividad
```bash
# Ping al dominio
ping tudominio.com

# Test de puerto 443 (HTTPS)
telnet tudominio.com 443
```

### Test 4: Verificar con cURL
```bash
curl -I https://tudominio.com
```

Debe mostrar:
```
HTTP/2 200
...
```

---

## 📊 Monitoreo

### Herramientas de Monitoreo:
1. **UptimeRobot** (Gratis)
   - [uptimerobot.com](https://uptimerobot.com)
   - Monitorea cada 5 minutos
   - Alertas por email

2. **Pingdom** (Pago)
   - Monitoreo avanzado
   - Reportes detallados

3. **StatusPage** (Gratis/Pago)
   - Página de estado pública
   - Tus usuarios pueden ver si el sitio está caído

---

## 🆘 Soporte para Usuarios

### Mensaje para WhatsApp/Redes Sociales:

```
🔧 ¿Problemas para acceder a Golazo Store?

Si ves un error de conexión, prueba esto:

1️⃣ Usa VPN (Psiphon, Turbo VPN, Lantern)
2️⃣ Usa Opera Browser (tiene VPN gratis)
3️⃣ Cambia DNS a 8.8.8.8 (Google DNS)
4️⃣ Usa datos móviles en vez de WiFi
5️⃣ Intenta en la madrugada (1-6 AM)

¿Sigues con problemas? Escríbenos y te ayudamos 💪
```

### Botón de Ayuda en el Sitio

Ya agregué un botón flotante "¿Problemas de conexión?" en la esquina inferior derecha del sitio que muestra instrucciones paso a paso para los usuarios.

---

## 📈 Estadísticas de Acceso

### Tracking de Problemas:
Agrega esto a tu código para trackear errores de conexión:

```javascript
window.addEventListener('error', (event) => {
  if (event.message.includes('NetworkError') || 
      event.message.includes('Failed to fetch')) {
    // Enviar a tu sistema de analytics
    console.log('Error de conexión detectado');
  }
});
```

---

## ✅ Checklist de Solución

### Para el Administrador:
- [ ] Verificar SSL/TLS en Cloudflare (modo Full)
- [ ] Verificar certificado activo
- [ ] Activar "Always Use HTTPS"
- [ ] Configurar Page Rules
- [ ] Considerar dominio personalizado
- [ ] Configurar monitoreo (UptimeRobot)
- [ ] Probar acceso desde Cuba con y sin VPN

### Para los Usuarios:
- [ ] Intentar con VPN
- [ ] Cambiar DNS
- [ ] Usar Opera Browser
- [ ] Probar con datos móviles
- [ ] Intentar en horarios de menor congestión
- [ ] Limpiar caché del navegador
- [ ] Probar en otro navegador

---

## 🎯 Conclusión

El problema es de **infraestructura de red en Cuba**, no del código de la aplicación. Las soluciones más efectivas son:

1. **Para ti (admin)**: Verificar SSL en Cloudflare, considerar dominio personalizado
2. **Para usuarios**: Usar VPN o cambiar DNS

El botón de ayuda que agregué en el sitio guiará a los usuarios through las soluciones.

---

**Última actualización**: 2026-01-27  
**Estado**: ✅ Soluciones documentadas y botón de ayuda implementado
