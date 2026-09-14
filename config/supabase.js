const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: SUPABASE_URL atau SUPABASE_KEY belum diatur di file .env');
  process.exit(1);
}

// Inisialisasi Supabase Client (menggunakan parameterized safe query secara bawaan)
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
