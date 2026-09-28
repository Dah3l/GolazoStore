# 🔒 Solución de Problemas de Certificados SSL

## ❌ Error: PR_CONNECT_RESET_ERROR (Firefox)

Este error específicamente indica problemas con la validación de certificados SSL/TLS.

---

## 🔍 Diagnóstico de Certificados

### Test 1: Verificar Certificado con OpenSSL

```bash
# En terminal (Linux/Mac/Windows con Git Bash)
openssl s_client -connect golazo-store.pages.dev:443 -servername golazo-store.pages.dev 2>/dev/null | openssl x509 -noout -dates -subject -issuer
```

**Resultado esperado:**
```
notBefore=Jan 27 00:00:00 2026 GMT
notAfter=Apr 27 23:59:59 2026 GMT
subject=CN=*.pages.dev
issuer=C=US, O=Cloudflare\, Inc., CN=Cloudflare Inc ECC CA-3
```

### Test 2: SSL Labs Test

Visita: https://www.ssllabs.com/ssltest/analyze.html?d=golazo-store.pages.dev

**Debe mostrar:**
- ✅ Grade A o A+
- ✅ Certificate valid
- ✅ Chain issues: None
- ✅ Protocol support: TLS 1.2, TLS 1.3

### Test 3: Verificar en Navegador

1. Abre Firefox
2. Ve a tu sitio
3. Click en el candado 🔒 (o "No seguro")
4. Click en "Conexión segura" → "Más información"
5. Revisa:
   - Emisor del certificado
   - Fecha de expiración
   - Cadena de certificados

---

## 🛠️ Soluciones

### **Solución 1: Forzar Renovación del Certificado en Cloudflare**

#### Paso 1: Acceder a Cloudflare
1. Ve a [dash.cloudflare.com](https://dash.cloudflare.com)
2. Selecciona tu proyecto de Pages

#### Paso 2: Verificar Estado del Certificado
1. Ve a **Custom domains** (si tienes dominio personalizado)
2. O ve a **Pages project** → **Custom domains**
3. Verifica el estado del certificado:
   - ✅ **Active**: Certificado válido
   - ⚠️ **Pending**: Esperando emisión (espera 5-10 min)
   - ❌ **Failed**: Error en la emisión

#### Paso 3: Forzar Renovación
Si el certificado está fallando o expirado:

1. Ve a **SSL/TLS** → **Edge Certificates**
2. Busca tu certificado
3. Click en **Actions** → **Renew certificate**
4. Espera 5-10 minutos

#### Paso 4: Verificar Configuración SSL
1. Ve a **SSL/TLS** → **Overview**
2. Asegúrate de que el modo sea **"Full"** o **"Full (strict)"**
3. NO debe estar en "Flexible"

```
✅ Correcto: Full (strict)
✅ Correcto: Full
❌ Incorrecto: Flexible
❌ Incorrecto: Off
```

### **Solución 2: Usar Dominio Personalizado con Certificado Propio**

Los certificados `*.pages.dev` a veces tienen problemas en Cuba. Un dominio personalizado con su propio certificado es más confiable.

#### Paso 1: Comprar Dominio
- **Namecheap**: https://www.namecheap.com (~$10/año)
- **GoDaddy**: https://www.godaddy.com (~$12/año)
- **Cloudflare Registrar**: https://www.cloudflare.com/products/registrar/ (~$10/año, sin markup)

**Recomendación**: Compra un dominio `.com` simple como `golazostore.com`

#### Paso 2: Agregar Dominio a Cloudflare
1. Ve a **Cloudflare Pages** → **Custom domains**
2. Click en **Set up a custom domain**
3. Ingresa tu dominio: `golazostore.com`
4. Cloudflare te dará instrucciones para cambiar los DNS

#### Paso 3: Cambiar DNS
En tu registrador de dominio:

**Opción A: Usar los nameservers de Cloudflare (Recomendado)**
```
ns1.cloudflare.com
ns2.cloudflare.com
```

**Opción B: Agregar registros CNAME**
```
Tipo: CNAME
Nombre: @
Contenido: golazo-store.pages.dev
Proxy: Activado (nube naranja)

Tipo: CNAME
Nombre: www
Contenido: golazo-store.pages.dev
Proxy: Activado (nube naranja)
```

#### Paso 4: Esperar Propagación DNS
- **Tiempo**: 24-48 horas (usualmente 1-2 horas)
- **Verificar**: https://dnschecker.org/

#### Paso 5: Verificar Certificado
Una vez que el dominio esté activo:
1. Ve a **SSL/TLS** → **Edge Certificates**
2. Verifica que el certificado esté **Active**
3. El certificado será para `golazostore.com` y `*.golazostore.com`

### **Solución 3: Configurar Certificado SSL Personalizado**

Si necesitas control total sobre el certificado:

#### Opción A: Let's Encrypt (Gratis)
```bash
# Instalar Certbot
sudo apt install certbot

# Generar certificado
sudo certbot certonly --manual -d golazostore.com -d www.golazostore.com
```

#### Opción B: Cloudflare Universal SSL
Cloudflare ya emite certificados Universal SSL automáticamente, pero puedes:
1. Ir a **SSL/TLS** → **Edge Certificates**
2. Activar **Universal SSL** si no está activo
3. Esperar 5-10 minutos

### **Solución 4: Forzar HTTPS y HSTS**

#### Paso 1: Activar Always Use HTTPS
1. Ve a **SSL/TLS** → **Edge Certificates**
2. Activa **Always Use HTTPS**

#### Paso 2: Activar HSTS (HTTP Strict Transport Security)
1. Ve a **SSL/TLS** → **Edge Certificates**
2. Activa **HSTS**
3. Configura:
   - **Max age**: 6 months (15768000 seconds)
   - **Include subdomains**: ON
   - **Preload**: ON

#### Paso 3: Crear Page Rule
1. Ve a **Rules** → **Page Rules**
2. Crea nueva regla:
   - **URL**: `*golazostore.com/*`
   - **Settings**:
     - Always Use HTTPS: ON
     - Security Level: Medium
   - **Status**: Active

### **Solución 5: Verificar Chain de Certificados**

A veces el problema es que falta un certificado intermedio.

#### Test:
```bash
# Verificar cadena completa
openssl s_client -connect golazostore.com:443 -servername golazostore.com -showcerts
```

#### Solución:
1. Ve a **SSL/TLS** → **Edge Certificates**
2. Activa **Always Use HTTPS**
3. Activa **Automatic HTTPS Rewrites**
4. Espera 5-10 minutos

---

## 🇨🇺 Problemas Específicos en Cuba

### Causa: Interferencia del ISP (ETECSA)

ETECSA puede estar:
1. **Interceptando tráfico HTTPS** (man-in-the-middle)
2. **Bloqueando ciertos certificados** de Cloudflare
3. **Modificando la cadena de certificados**

### Soluciones para Cuba:

#### 1. Usar Dominio Personalizado
- Los dominios propios tienen menos problemas que `*.pages.dev`
- Cloudflare emite certificados específicos para tu dominio

#### 2. Usar Cloudflare Proxy (Nube Naranja)
- Activa el proxy en los DNS
- Cloudflare maneja el SSL/TLS
- Oculta tu IP real

#### 3. Configurar TLS 1.3
1. Ve a **SSL/TLS** → **Edge Certificates**
2. Activa **TLS 1.3**
3. TLS 1.3 es más seguro y tiene menos problemas de intermediarios

#### 4. Usar Certificado de Cloudflare (no Let's Encrypt)
- Los certificados de Cloudflare son más confiables en Cuba
- Cloudflare tiene mejor routing desde Cuba

---

## 🧪 Herramientas de Diagnóstico

### 1. SSL Labs Test
https://www.ssllabs.com/ssltest/

**Verifica:**
- Certificate chain: Complete
- Certificate valid: Yes
- Protocol support: TLS 1.2, TLS 1.3
- Grade: A o A+

### 2. Why No Padlock
https://www.whynopadlock.com/

**Verifica:**
- Mixed content: None
- Certificate chain: Complete

### 3. DNS Checker
https://dnschecker.org/

**Verifica:**
- DNS propagation: Complete
- All regions: Resolving correctly

### 4. Certificate Transparency
https://crt.sh/

**Verifica:**
- Certificados emitidos para tu dominio
- Fecha de emisión y expiración

---

## 📋 Checklist de Certificados

### Para Cloudflare Pages:
- [ ] SSL/TLS mode: Full (strict)
- [ ] Always Use HTTPS: ON
- [ ] Automatic HTTPS Rewrites: ON
- [ ] Edge Certificate: Active
- [ ] Universal SSL: ON
- [ ] HSTS: ON (opcional pero recomendado)
- [ ] TLS 1.3: ON
- [ ] Minimum TLS version: 1.2

### Para Dominio Personalizado:
- [ ] Dominio comprado y verificado
- [ ] DNS configurado correctamente
- [ ] Propagación DNS completa (24-48h)
- [ ] Certificado emitido y activo
- [ ] Proxy activado (nube naranja)
- [ ] Prueba de acceso exitosa

### Para Verificación:
- [ ] SSL Labs test: Grade A o A+
- [ ] Certificado válido (no expirado)
- [ ] Cadena de certificados completa
- [ ] Sin mixed content
- [ ] Acceso exitoso desde Cuba con y sin VPN

---

## 🚨 Errores Comunes y Soluciones

### Error: "NET::ERR_CERTIFICATE_TRANSPARENCY_REQUIRED"
**Causa**: Falta Certificate Transparency
**Solución**: 
1. Ve a **SSL/TLS** → **Edge Certificates**
2. Activa **Certificate Transparency**

### Error: "ERR_CERT_COMMON_NAME_INVALID"
**Causa**: El certificado no coincide con el dominio
**Solución**:
1. Verifica que el dominio esté correctamente configurado
2. Espera 5-10 minutos para que se emita el certificado
3. Limpia caché del navegador

### Error: "ERR_CERT_DATE_INVALID"
**Causa**: Certificado expirado o no válido aún
**Solución**:
1. Ve a **SSL/TLS** → **Edge Certificates**
2. Renueva el certificado
3. Espera 5-10 minutos

### Error: "ERR_CERT_AUTHORITY_INVALID"
**Causa**: Certificado no reconocido por el navegador
**Solución**:
1. Verifica que el certificado sea de Cloudflare o Let's Encrypt
2. Actualiza tu sistema operativo y navegador
3. Limpia caché de certificados

### Error: "PR_CONNECT_RESET_ERROR" (Firefox)
**Causa**: Problema con la validación del certificado
**Solución**:
1. Verifica SSL Labs test
2. Fuerza renovación del certificado
3. Considera usar dominio personalizado
4. En Cuba: Usa VPN o cambia DNS

---

## 📞 Soporte de Cloudflare

Si nada funciona, contacta a Cloudflare:
- **Soporte**: https://support.cloudflare.com/
- **Comunidad**: https://community.cloudflare.com/
- **Estado**: https://www.cloudflarestatus.com/

---

## ✅ Solución Recomendada para Tu Caso

Dado que el problema ocurre en Cuba y funciona con VPN:

### **Solución Inmediata:**
1. ✅ Verificar SSL en Cloudflare (modo Full)
2. ✅ Forzar renovación del certificado
3. ✅ Activar Always Use HTTPS y HSTS

### **Solución a Largo Plazo:**
1. ⏳ Comprar dominio personalizado (`golazostore.com`)
2. ⏳ Configurar DNS en Cloudflare
3. ⏳ Esperar propagación (24-48h)
4. ⏳ Verificar certificado para dominio propio

### **Para Usuarios en Cuba:**
1. ✅ Usar VPN (Psiphon, Turbo VPN)
2. ✅ Usar Opera Browser (VPN integrada)
3. ✅ Cambiar DNS a 8.8.8.8
4. ✅ Botón de ayuda en el sitio (ya implementado)

---

**Última actualización**: 2026-01-27  
**Estado**: 🔧 Diagnóstico completo, soluciones implementadas
