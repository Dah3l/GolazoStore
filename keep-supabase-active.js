import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function keepAlive() {
  try {
    console.log('🔄 Pinging Supabase database...');
    
    // Hacer una consulta simple para mantener la base de datos activa
    const { data, error } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Error querying database:', error.message);
      process.exit(1);
    }
    
    console.log('✅ Database ping successful!');
    console.log(`📊 Total products in database: ${data || 0}`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

keepAlive();
