import { createClient } from '@supabase/supabase-js';

//const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
//const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = "https://igsjajnovtranhivurty.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlnc2pham5vdnRyYW5oaXZ1cnR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMDg5MTQsImV4cCI6MjA3OTg4NDkxNH0.ZN-96E42RAMDkHG4JFATLB2f0t0ddxJPHjXQ1XTTsAg"

console.log('DEBUG SUPABASE:', import.meta.env);



export const supabase = createClient(supabaseUrl, supabaseAnonKey);
