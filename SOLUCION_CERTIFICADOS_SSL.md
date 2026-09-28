# 🔒 Solución de Problemas de Certificados SSL/TLS en Cloudflare Pages

## ❌ Error: PR_CONNECT_RESET_ERROR (Firefox)

Este error específico de Firefox indica problemas con el handshake SSL/TLS, generalmente relacionado con:
- Certificados SSL mal configurados
- Protocolos TLS incompatibles
- Cipher suites no soportados
- Certificados intermedios faltantes

---

## 🔍 Diagnóstico del Certificado

### Paso 1: Verificar el Certificado Online

Usa estas herramientas para analizar tu certificado:

#### 1. SSL Labs Test (Más Completo)
1. Ve a: https://www.ssllabs.com/ssltest/
2. Ingresa tu dominio: `tudominio.pages.dev`
3. Espera el análisis (2-3 minutos)
4. Revisa el resultado:
   - **Grade A+**: Perfecto
   - **Grade A**: Bueno
   - **Grade B o menor**: Problemas detectados

#### 2. Verificar Chain de Certificados
1. Ve a: https://www.whynopadlock.com/
2. Ingresa tu dominio
3. Verifica que la cadena de certificados esté completa

#### 3. Verificar Protocolos TLS
1. Ve a: https://www.cryptoreportweb.com/
2. Ingresa tu dominio
3. Revisa qué protocolos TLS están habilitados

### Paso 2: Diagnóstico desde Terminal

#### En Linux/Mac:
```bash
# Ver información del certificado
openssl s_client -connect tudominio.pages.dev:443 -servername tudominio.pages.dev

# Verificar protocolo TLS
openssl s_client -connect tudominio.pages.dev:443 -tls1_2
openssl s_client -connect tudominio.pages.dev:443 -tls1_3

# Ver cipher suites soportados
openssl s_client -connect tudominio.pages.dev:443 -cipher 'HIGH:!aNULL:!MD5'
```

#### En Windows (PowerShell):
```powershell
# Test básico de conexión SSL
Test-NetConnection -ComputerName tudominio.pages.dev -Port 443

# Ver certificado (requiere módulo)
Invoke-WebRequest -Uri https://tudominio.pages.dev -Method Head
```

### Paso 3: Verificar en el Navegador

#### En Firefox:
1. Abre el sitio
2. Click en el candado 🔒 (o el ícono de error)
3. "Más información" → "Ver certificado"
4. Revisa:
   - Emisor del certificado
   - Fecha de validez
   - Chain de certificados completa

#### En Chrome:
1. Abre el sitio
2. F12 → Pestaña "Security"
3. Click en "View certificate"
4. Revisa la cadena de certificados

---

## 🛠️ Soluciones en Cloudflare

### Solución 1: Verificar Modo SSL/TLS

#### Paso a Paso:
1. Ve a [dash.cloudflare.com](https://dash.cloudflare.com)
2. Selecciona tu proyecto
3. Menú lateral: **SSL/TLS** → **Overview**
4. Verifica el modo:

**Modos Disponibles:**
- ❌ **Off**: Sin SSL (NO usar)
- ❌ **Flexible**: SSL solo entre usuario y Cloudflare (NO usar)
- ✅ **Full**: SSL en ambos lados (RECOMENDADO)
- ✅ **Full (strict)**: SSL estricto con certificado válido (MÁS SEGURO)

**Acción:**
- Si está en "Flexible" → Cambia a **"Full"**
- Si está en "Full" → Prueba **"Full (strict)"**
- Si está en "Full (strict)" → Prueba **"Full"**

### Solución 2: Verificar Certificado Edge

1. Ve a **SSL/TLS** → **Edge Certificates**
2. Verifica:
   - ✅ Estado: **Active**
   - ✅ Tipo: **Universal** o **Dedicated**
   - ✅ Emisor: **Cloudflare Inc**
   - ✅ Validez: No expirado

**Si el certificado no está activo:**
1. Click en **"Renew"** o **"Reissue"**
2. Espera 5-10 minutos
3. Verifica que el estado cambie a "Active"

### Solución 3: Configurar Minimum TLS Version

1. Ve a **SSL/TLS** → **Edge Certificates**
2. Busca **"Minimum TLS Version"**
3. Configura:
   - **Recomendado**: TLS 1.2
   - **Alternativa**: TLS 1.0 (solo si hay problemas)

**¿Por qué?**
- Algunos navegadores antiguos no soportan TLS 1.3
- TLS 1.2 es compatible con casi todos los navegadores
- TLS 1.0 es menos seguro pero más compatible

### Solución 4: Configurar Cipher Suites

1. Ve a **SSL/TLS** → **Edge Certificates**
2. Busca **"Cipher Suites"**
3. Selecciona: **"Recommended"** o **"Compatible"**

**Cipher Suites Recomendados:**
```
ECDHE-ECDSA-AES128-GCM-SHA256
ECDHE-RSA-AES128-GCM-SHA256
ECDHE-ECDSA-AES256-GCM-SHA384
ECDHE-RSA-AES256-GCM-SHA384
```

### Solución 5: Activar Opciones Adicionales

1. Ve a **SSL/TLS** → **Edge Certificates**
2. Activa estas opciones:
   - ✅ **Always Use HTTPS**
   - ✅ **Automatic HTTPS Rewrites**
   - ✅ **HSTS** (HTTP Strict Transport Security)
   - ✅ **Opportunistic Encryption**
   - ✅ **0-RTT** (si está disponible)

### Solución 6: Verificar Certificado de Origen (Origin Certificate)

Si usas un servidor propio (no solo Pages):

1. Ve a **SSL/TLS** → **Origin Server**
2. Click en **"Create Certificate"**
3. Descarga el certificado
4. Instálalo en tu servidor de origen

**Nota:** Esto NO aplica para Cloudflare Pages (solo para servidores propios)

---

## 🔧 Configuración Recomendada para Cloudflare Pages

### Configuración Óptima:

```
SSL/TLS Mode: Full
Minimum TLS Version: 1.2
Cipher Suites: Recommended
Always Use HTTPS: ON
Automatic HTTPS Rewrites: ON
HSTS: ON (max-age=31536000)
Opportunistic Encryption: ON
0-RTT: ON
```

### Configuración Alternativa (Máxima Compatibilidad):

```
SSL/TLS Mode: Full
Minimum TLS Version: 1.0
Cipher Suites: Compatible
Always Use HTTPS: ON
Automatic HTTPS Rewrites: ON
HSTS: OFF (puede causar problemas)
Opportunistic Encryption: ON
0-RTT: OFF
```

---

## 🧪 Testing Después de Cambios

### Test 1: Verificar en Múltiples Navegadores

1. **Firefox**: Debería cargar sin errores
2. **Chrome**: Verificar candado verde 🔒
3. **Safari**: Verificar en iOS/macOS
4. **Edge**: Verificar en Windows

### Test 2: Verificar en Dispositivos Móviles

1. **Android Chrome**: Debería cargar
2. **iOS Safari**: Debería cargar
3. **Samsung Internet**: Debería cargar

### Test 3: Herramientas Online

1. **SSL Labs**: Debería dar Grade A o A+
2. **Why No Padlock**: Debería mostrar "No issues found"
3. **GeoFlake**: Verificar desde múltiples ubicaciones

### Test 4: Comandos de Terminal

```bash
# Test desde diferentes ubicaciones
curl -I https://tudominio.pages.dev

# Verificar certificado
echo | openssl s_client -connect tudominio.pages.dev:443 -servername tudominio.pages.dev 2>/dev/null | openssl x509 -noout -dates

# Test de protocolos
nmap --script ssl-enum-ciphers -p 443 tudominio.pages.dev
```

---

## 🚨 Problemas Comunes y Soluciones

### Problema 1: Certificado No Confiable

**Síntoma:**
- Firefox: "Conexión no segura"
- Chrome: "NET::ERR_CERT_AUTHORITY_INVALID"

**Solución:**
1. Ve a **SSL/TLS** → **Edge Certificates**
2. Verifica que el certificado esté **Active**
3. Si no, click en **"Renew"**
4. Espera 5-10 minutos
5. Limpia caché del navegador

### Problema 2: Mixed Content

**Síntoma:**
- Candado amarillo o gris
- Advertencia de "contenido mixto"

**Solución:**
1. Ve a **SSL/TLS** → **Edge Certificates**
2. Activa **"Automatic HTTPS Rewrites"**
3. Verifica que todo tu contenido use HTTPS
4. Busca en tu código URLs con `http://` y cámbialas a `https://`

### Problema 3: Certificado Expirado

**Síntoma:**
- Error de certificado expirado
- Fecha de expiración pasada

**Solución:**
1. Ve a **SSL/TLS** → **Edge Certificates**
2. Click en **"Renew"**
3. Espera propagación (5-10 minutos)
4. Verifica nueva fecha de expiración

### Problema 4: Chain de Certificados Incompleta

**Síntoma:**
- SSL Labs muestra "Chain issues"
- Algunos navegadores no confían en el certificado

**Solución:**
1. Cloudflare debería manejar esto automáticamente
2. Si persiste, contacta soporte de Cloudflare
3. Verifica que estés usando un certificado de Cloudflare

### Problema 5: Protocolo TLS No Soportado

**Síntoma:**
- Error de handshake SSL
- Navegadores antiguos no pueden conectar

**Solución:**
1. Ve a **SSL/TLS** → **Edge Certificates**
2. Cambia **"Minimum TLS Version"** a **1.0**
3. Guarda y espera 5 minutos
4. Prueba nuevamente

---

## 📊 Monitoreo de Certificados

### Herramientas de Monitoreo:

#### 1. UptimeRobot (Gratis)
- URL: https://uptimerobot.com
- Monitorea cada 5 minutos
- Alertas por email
- Verifica SSL

#### 2. SSL Monitor (Gratis)
- URL: https://www.sslshopper.com/ssl-monitor.html
- Monitorea expiración de certificados
- Alertas 30 días antes de expirar

#### 3. StatusPage (Gratis/Pago)
- URL: https://www.statuspage.io
- Página de estado pública
- Tus usuarios pueden ver el estado del sitio

### Script de Monitoreo (Opcional):

```bash
#!/bin/bash
# save as check_ssl.sh

DOMAIN="tudominio.pages.dev"
EMAIL="tu@email.com"

# Verificar certificado
EXPIRY=$(echo | openssl s_client -connect $DOMAIN:443 -servername $DOMAIN 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s)
CURRENT_EPOCH=$(date +%s)
DAYS_LEFT=$(( ($EXPIRY_EPOCH - $CURRENT_EPOCH) / 86400 ))

if [ $DAYS_LEFT -lt 30 ]; then
    echo "ALERTA: Certificado expira en $DAYS_LEFT días" | mail -s "SSL Alert" $EMAIL
fi

# Verificar conexión
if ! curl -s -I https://$DOMAIN > /dev/null; then
    echo "ALERTA: No se puede conectar a $DOMAIN" | mail -s "Connection Alert" $EMAIL
fi
```

Ejecutar diariamente con cron:
```bash
0 0 * * * /path/to/check_ssl.sh
```

---

## 🎯 Checklist de Solución

### Diagnóstico:
- [ ] Ejecutar test en SSL Labs
- [ ] Verificar chain de certificados
- [ ] Verificar protocolos TLS soportados
- [ ] Probar en múltiples navegadores
- [ ] Probar en dispositivos móviles

### Configuración en Cloudflare:
- [ ] SSL/TLS Mode: Full o Full (strict)
- [ ] Minimum TLS Version: 1.2 o 1.0
- [ ] Cipher Suites: Recommended o Compatible
- [ ] Always Use HTTPS: ON
- [ ] Automatic HTTPS Rewrites: ON
- [ ] HSTS: ON (opcional)
- [ ] Certificado Edge: Active

### Testing:
- [ ] Firefox carga sin errores
- [ ] Chrome muestra candado verde
- [ ] Safari funciona en iOS
- [ ] Android Chrome funciona
- [ ] SSL Labs da Grade A o mejor
- [ ] Why No Padlock muestra "No issues"

### Monitoreo:
- [ ] Configurar UptimeRobot
- [ ] Configurar SSL Monitor
- [ ] Verificar alertas de expiración
- [ ] Monitorear desde múltiples ubicaciones

---

## 📞 Contacto con Soporte

Si después de todos estos pasos el problema persiste:

### Cloudflare Support:
1. Ve a: https://support.cloudflare.com/
2. Abre un ticket
3. Incluye:
   - Tu dominio
   - Screenshots del error
   - Resultados de SSL Labs
   - Configuración actual de SSL/TLS

### Información Útil para Soporte:
```
Dominio: tudominio.pages.dev
Error: PR_CONNECT_RESET_ERROR (Firefox)
SSL Labs Grade: [tu grade]
SSL/TLS Mode: Full
Minimum TLS: 1.2
Funciona con VPN: Sí
No funciona sin VPN: Sí
Navegadores afectados: Firefox, Chrome Android
```

---

## ✅ Conclusión

El problema PR_CONNECT_RESET_ERROR en Firefox es casi siempre un problema de configuración SSL/TLS. Sigue estos pasos:

1. **Diagnostica** con SSL Labs y herramientas online
2. **Configura** SSL/TLS correctamente en Cloudflare
3. **Prueba** en múltiples navegadores y dispositivos
4. **Monitorea** para detectar problemas futuros

La configuración recomendada es:
- SSL/TLS Mode: **Full**
- Minimum TLS: **1.2**
- Always Use HTTPS: **ON**
- Automatic HTTPS Rewrites: **ON**

---

**Última actualización**: 2026-01-27  
**Estado**: ✅ Guía completa de troubleshooting SSL/TLS
