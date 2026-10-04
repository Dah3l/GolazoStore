// Script para mantener Supabase activo - Sin dependencias
// Usa fetch nativo de Node.js (disponible desde Node 18+)

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set');
  process.exit(1);
}

async function keepAlive() {
  try {
    console.log('🔄 Pinging Supabase database...');
    
    // Hacer una consulta REST directa a Supabase (sin cliente oficial)
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/products?select=id&limit=1`,
      {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error en la respuesta:', response.status, response.statusText);
      console.error('Detalles:', errorText);
      process.exit(1);
    }
    
    const data = await response.json();
    console.log('✅ Database ping successful!');
    console.log(`📊 Productos encontrados: ${data.length}`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

keepAlive();
