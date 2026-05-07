/**
 * E2E Redemption Flow Test
 * Tests the full cycle: anonymous precheck → authenticated claim → entitlement check → designer access
 * Uses a FAKE order injected directly via service role to simulate a valid Amazon order in the DB.
 *
 * Run: node --env-file=.env test-e2e-redeem.mjs
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ryeviupygrrmoyxoycwl.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5ZXZpdXB5Z3JybW95eG95Y3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NzQzNzEsImV4cCI6MjA4ODA1MDM3MX0.dyNXDPiisIDfenfqXns_FYHn4CBFwNNmkVQDMtGgsn4";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const TEST_EMAIL = "ivllnv.000@gmail.com";
const TEST_PASSWORD = "123456";
const FAKE_ORDER_NUM = `E2E-TEST-${Date.now()}`;
const FAKE_STRIPE_SESSION = `test_session_${Date.now()}`;

const anonClient = createClient(SUPABASE_URL, ANON_KEY);
const adminClient = SERVICE_ROLE_KEY ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY) : null;

function pass(msg) { console.log(`  ✅ ${msg}`); }
function fail(msg) { console.log(`  ❌ ${msg}`); process.exitCode = 1; }
function info(msg) { console.log(`  ℹ️  ${msg}`); }
function section(msg) { console.log(`\n── ${msg} ──────────────────────────────────`); }

let testOrderId = null;
let testUserId = null;

async function seedFakeAmazonOrder() {
    section("SETUP: Seeding fake Amazon order");
    if (!adminClient) {
        fail("SUPABASE_SERVICE_ROLE_KEY not set — cannot seed test data. Run with --env-file=.env");
        process.exit(1);
    }

    // Seed order
    const { data: order, error: orderErr } = await adminClient
        .from("orders")
        .insert({
            order_number: FAKE_ORDER_NUM,
            stripe_session_id: FAKE_STRIPE_SESSION,
            mcf_order_id: FAKE_ORDER_NUM,
            customer_email: TEST_EMAIL,
            status: "paid",
            total_amount: 0,
            currency: "usd",
            items: { source: "amazon", note: "e2e test" }
        })
        .select("id")
        .single();

    if (orderErr || !order) { fail(`Failed to seed order: ${orderErr?.message}`); process.exit(1); }
    testOrderId = order.id;
    pass(`Order seeded: ${testOrderId} (order_number: ${FAKE_ORDER_NUM})`);

    // Seed order_item (ai-designer)
    const { error: itemErr } = await adminClient
        .from("order_items")
        .insert({
            order_id: testOrderId,
            product_type: "ai-designer",
            product_name: "AI Designer Access [E2E Test]",
            quantity: 1,
            unit_amount: 0,
            stripe_line_item_id: `${FAKE_STRIPE_SESSION}_item`
        });

    if (itemErr) { fail(`Failed to seed order_item: ${itemErr.message}`); process.exit(1); }
    pass("order_item (ai-designer) seeded");
}

async function cleanup() {
    section("CLEANUP: Removing test data");
    if (!adminClient || !testOrderId) { info("Nothing to clean up"); return; }

    await adminClient.from("entitlements").delete().eq("order_id", testOrderId);
    await adminClient.from("access_requests").delete().eq("order_id", testOrderId);
    await adminClient.from("order_items").delete().eq("order_id", testOrderId);
    await adminClient.from("orders").delete().eq("id", testOrderId);

    // Remove entitlement from user if user was resolved
    if (testUserId) {
        await adminClient.from("entitlements").delete()
            .eq("user_id", testUserId).eq("order_id", testOrderId);
    }
    pass("All test data cleaned up");
}

async function testStageA() {
    section("STAGE A: Anonymous pre-check (no auth)");

    const { data, error } = await anonClient.functions.invoke("verify-order", {
        body: { order_number: FAKE_ORDER_NUM, email: TEST_EMAIL }
    });

    if (error) { fail(`Function error: ${error.message}`); return false; }
    info(`Response: ${JSON.stringify(data)}`);

    if (data?.state === "success") {
        pass("Stage A returned 'success' — order is recognized and ready to claim");
        return true;
    } else {
        fail(`Expected state 'success', got '${data?.state}'`);
        return false;
    }
}

async function testStageB() {
    section("STAGE B: Authenticated claim");

    // Sign in
    const { data: auth, error: authErr } = await anonClient.auth.signInWithPassword({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
    });

    if (authErr || !auth.session) { fail(`Auth failed: ${authErr?.message}`); return false; }
    const token = auth.session.access_token;
    testUserId = auth.user.id;
    pass(`Signed in as ${TEST_EMAIL} (uid: ${testUserId})`);

    // Invoke verify-order with auth token
    const { data, error } = await anonClient.functions.invoke("verify-order", {
        body: { order_number: FAKE_ORDER_NUM, email: TEST_EMAIL },
        headers: { Authorization: `Bearer ${token}` }
    });

    if (error) { fail(`Function error: ${error.message}`); return false; }
    info(`Response: ${JSON.stringify(data)}`);

    if (data?.state === "success") {
        pass("Stage B returned 'success' — entitlement has been claimed!");
        return { success: true, token };
    } else {
        fail(`Expected state 'success', got '${data?.state}'`);
        return { success: false, token };
    }
}

async function testGetEntitlement(token) {
    section("CHECK: get-entitlement");

    const res = await fetch(`${SUPABASE_URL}/functions/v1/get-entitlement`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "x-client-info": "e2e-test"
        }
    });
    const body = await res.json();
    info(`Status: ${res.status}, Body: ${JSON.stringify(body)}`);

    if (res.status === 200 && body.has_access === true) {
        pass("get-entitlement confirms has_access: true ✓");
        return true;
    } else {
        fail(`get-entitlement returned has_access: ${body.has_access} (expected true)`);
        return false;
    }
}

async function testAiDesigner(token) {
    section("CHECK: ai-designer function (live prompt)");

    const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-designer`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Hello! Can you suggest a simple flower arrangement for a beginner?",
            history: []
        })
    });
    const text = await res.text();
    info(`Status: ${res.status}`);
    info(`Body: ${text.substring(0, 300)}`);

    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = null; }

    if (res.status === 200 && (parsed?.reply || parsed?.response)) {
        const preview = (parsed.reply || parsed.response || "").substring(0, 120).replace(/\n/g, " ");
        pass(`ai-designer responded successfully`);
        info(`Preview: "${preview}..."`);
        return true;
    } else if (res.status === 403) {
        fail(`ai-designer returned 403 — entitlement guard is blocking access`);
        return false;
    } else if (res.status === 500) {
        fail(`ai-designer returned 500 — check GOOGLE_API_KEY or entitlement DB error`);
        return false;
    } else {
        fail(`Unexpected status ${res.status}`);
        return false;
    }
}

async function testAlreadyRedeemed() {
    section("CHECK: Second redemption attempt (should be blocked)");

    const { data, error } = await anonClient.functions.invoke("verify-order", {
        body: { order_number: FAKE_ORDER_NUM, email: TEST_EMAIL }
    });

    if (error) { fail(`Function error: ${error.message}`); return; }
    info(`Response: ${JSON.stringify(data)}`);

    if (data?.state === "already-redeemed") {
        pass("Second attempt correctly blocked with 'already-redeemed'");
    } else {
        fail(`Expected 'already-redeemed', got '${data?.state}'`);
    }
}

async function testFakeOrder() {
    section("CHECK: Fake/random order ID (should be 'not-found')");

    const { data, error } = await anonClient.functions.invoke("verify-order", {
        body: { order_number: "FAKE-ORDER-XYZ-999", email: "nobody@example.com" }
    });

    if (error) { fail(`Function error: ${error.message}`); return; }
    info(`Response: ${JSON.stringify(data)}`);

    if (data?.state === "not-found") {
        pass("Fake order correctly returned 'not-found'");
    } else {
        fail(`Expected 'not-found', got '${data?.state}'`);
    }
}

// ── Run ────────────────────────────────────────────────────────────────────────
console.log("=================================================");
console.log("  Hwabelle AI Designer — E2E Redemption Test");
console.log("=================================================");

try {
    await seedFakeAmazonOrder();
    await testStageA();

    const { success: stageBOk, token } = await testStageB();

    if (stageBOk && token) {
        await testGetEntitlement(token);
        await testAiDesigner(token);
        await testAlreadyRedeemed();
    }

    await testFakeOrder();
} finally {
    await cleanup();
}

console.log("\n=================================================");
console.log("  Test run complete.");
console.log("=================================================\n");
