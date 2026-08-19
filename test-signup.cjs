const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ryeviupygrrmoyxoycwl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5ZXZpdXB5Z3JybW95eG95Y3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NzQzNzEsImV4cCI6MjA4ODA1MDM3MX0.dyNXDPiisIDfenfqXns_FYHn4CBFwNNmkVQDMtGgsn4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runSignUp() {
    console.log("Attempting sign up with manolitoaquino0416@gmail.com...");
    try {
        const { data, error } = await supabase.auth.signUp({
            email: 'manolitoaquino0416@gmail.com',
            password: '12345678'
        });

        if (error) {
            console.error("Sign up failed with error:", error.message);
        } else {
            console.log("Sign up call completed successfully!");
            console.log("User:", data.user ? { id: data.user.id, email: data.user.email, identities: data.user.identities } : null);
            console.log("Session:", data.session);
        }
    } catch (e) {
        console.error("Sign up exception:", e);
    }
}

runSignUp();
