import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ryeviupygrrmoyxoycwl.supabase.co";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5ZXZpdXB5Z3JybW95eG95Y3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NzQzNzEsImV4cCI6MjA4ODA1MDM3MX0.dyNXDPiisIDfenfqXns_FYHn4CBFwNNmkVQDMtGgsn4";
const client = createClient(supabaseUrl, anonKey);

async function test() {
    console.log("Invoking verify-order...");
    const { data, error } = await client.functions.invoke("verify-order", {
        body: { order_number: "CONSUMER-202654-22248", email: "ivllnv.000@gmail.com" }
    });
    console.log("Data:", data);
    console.log("Error:", error);
}

test();
