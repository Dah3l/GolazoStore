import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yyfpiyjwtrrvrsbmtgog.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5ZnBpeWp3dHJydnJzYm10Z29nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0OTE3NDEsImV4cCI6MjEwNjA2Nzc0MX0.gVjHPQjXlyWTAgc0xPUuoT07P_9Y6fGVto_fXdC01as';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
