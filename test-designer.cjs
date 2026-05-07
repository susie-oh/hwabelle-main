const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ryeviupygrrmoyxoycwl.supabase.co', process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5ZXZpdXB5Z3JybW95eG95Y3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NzQzNzEsImV4cCI6MjA4ODA1MDM3MX0.dyNXDPiisIDfenfqXns_FYHn4CBFwNNmkVQDMtGgsn4');
async function test() {
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'ivllnv.000@gmail.com',
    password: '123456'
  });
  console.log('Auth:', authErr || authData.session?.access_token ? 'Success' : 'Fail');
  if (authData?.session?.access_token) {
    const res = await fetch('https://ryeviupygrrmoyxoycwl.supabase.co/functions/v1/ai-designer', {
      method: 'POST',
      headers: { 
        Authorization: 'Bearer ' + authData.session.access_token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: "Hello", history: [] })
    });
    console.log('Designer Status:', res.status, await res.text());
  }
}
test();
