export default {
  async scheduled(event, env, ctx) {
    console.log('🔄 Iniciando ping a Supabase...');
    
    try {
      // Hacer una consulta simple a la API REST de Supabase
      const response = await fetch(
        `${env.SUPABASE_URL}/rest/v1/products?select=id&limit=1`,
        {
          method: 'GET',
          headers: {
            'apikey': env.SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Supabase ping exitoso!');
        console.log(`📊 Productos en DB: ${data.length}`);
        console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
      } else {
        console.error('❌ Error en la respuesta:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Detalles:', errorText);
      }
    } catch (error) {
      console.error('❌ Error inesperado:', error.message);
    }
  },
  
  async fetch(request, env, ctx) {
    // Endpoint manual para probar el ping
    const url = new URL(request.url);
    
    if (url.pathname === '/ping') {
      try {
        const response = await fetch(
          `${env.SUPABASE_URL}/rest/v1/products?select=id&limit=1`,
          {
            method: 'GET',
            headers: {
              'apikey': env.SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.ok) {
          return new Response(JSON.stringify({
            status: 'success',
            message: 'Supabase ping exitoso',
            timestamp: new Date().toISOString()
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } else {
          return new Response(JSON.stringify({
            status: 'error',
            message: 'Error en la respuesta de Supabase',
            details: await response.text()
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } catch (error) {
        return new Response(JSON.stringify({
          status: 'error',
          message: error.message
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    return new Response('Cloudflare Worker para mantener Supabase activo', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
