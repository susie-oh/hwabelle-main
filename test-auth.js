const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ryeviupygrrmoyxoycwl.supabase.co', process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5ZXZpdXB5Z3JybW95eG95Y3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NzQzNzEsImV4cCI6MjA4ODA1MDM3MX0.dyNXDPiisIDfenfqXns_FYHn4CBFwNNmkVQDMtGgsn4');
async function test() {
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'ivllnv.000@gmail.com',
    password: 'password123'
  });
}
test();
