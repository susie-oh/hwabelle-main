const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ryeviupygrrmoyxoycwl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5ZXZpdXB5Z3JybW95eG95Y3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NzQzNzEsImV4cCI6MjA4ODA1MDM3MX0.dyNXDPiisIDfenfqXns_FYHn4CBFwNNmkVQDMtGgsn4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runTest() {
    console.log("Attempting sign in with manolitoaquino0416@gmail.com...");
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: 'manolitoaquino0416@gmail.com',
        password: '12345678'
    });

    if (authErr) {
        console.error("Sign in failed:", authErr.message);
        return;
    }

    const session = authData.session;
    console.log("Sign in successful. User ID:", session.user.id);
    console.log("Access Token JWT starts with:", session.access_token.substring(0, 15));

    console.log("\nCalling lookup-orders function...");
    try {
        const response = await fetch(`${supabaseUrl}/functions/v1/lookup-orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ action: 'my-orders' })
        });

        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Response body:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Function call failed:", err);
    }
}

runTest();
