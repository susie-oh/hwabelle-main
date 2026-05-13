/**
 * Reset claim for a specific order ID so it can be re-tested.
 * Run: node --env-file=.env reset-claim.mjs
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ryeviupygrrmoyxoycwl.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ORDER_NUMBER = "S01-0829002-9218055";

if (!SERVICE_ROLE_KEY) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env and re-run.");
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

console.log(`\n🔍 Looking up order: ${ORDER_NUMBER}...`);

const { data: order, error: orderErr } = await admin
  .from("orders")
  .select("id, order_number, mcf_order_id, user_id, status, customer_email")
  .or(`order_number.eq.${ORDER_NUMBER},mcf_order_id.eq.${ORDER_NUMBER}`)
  .limit(1)
  .maybeSingle();

if (orderErr || !order) {
  console.error("❌ Order not found:", orderErr?.message ?? "no row returned");
  process.exit(1);
}

console.log(`✅ Found order: ${order.id} | email: ${order.customer_email} | status: ${order.status}`);

// 1. Clear entitlement user link
const { error: entErr } = await admin
  .from("entitlements")
  .update({ user_id: null })
  .eq("order_id", order.id)
  .eq("product_type", "ai-designer");
console.log(entErr ? `⚠️  Entitlements: ${entErr.message}` : "✅ Entitlements: user_id cleared");

// 2. Reset access_request
const { error: arErr } = await admin
  .from("access_requests")
  .update({
    status: "pending",
    redemption_count: 0,
    redeemed_by_user_id: null,
    updated_at: new Date().toISOString(),
  })
  .eq("order_id", order.id);
console.log(arErr ? `⚠️  access_requests: ${arErr.message}` : "✅ access_requests: reset to pending");

// 3. Clear order user link
const { error: ordErr } = await admin
  .from("orders")
  .update({ user_id: null })
  .eq("id", order.id);
console.log(ordErr ? `⚠️  orders: ${ordErr.message}` : "✅ orders: user_id cleared");

console.log(`\n✅ Done — ${ORDER_NUMBER} is ready to be claimed again.\n`);
