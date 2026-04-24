import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

// ─── LWA Token Exchange ────────────────────────────────────────────
// Exchange the refresh token for a short-lived access token via
// Login with Amazon (LWA). This is the SP-API auth flow that
// replaces the old AWS Signature v4 requirement.
// ────────────────────────────────────────────────────────────────────

interface LwaTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

async function getAccessToken(): Promise<string> {
    const clientId = Deno.env.get("AMAZON_SP_CLIENT_ID");
    const clientSecret = Deno.env.get("AMAZON_SP_CLIENT_SECRET");
    const refreshToken = Deno.env.get("AMAZON_SP_REFRESH_TOKEN");

    if (!clientId || !clientSecret || !refreshToken) {
        throw new Error("Missing Amazon SP-API credentials (CLIENT_ID, CLIENT_SECRET, or REFRESH_TOKEN)");
    }

    const res = await fetch("https://api.amazon.com/auth/o2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret,
        }),
    });

    if (!res.ok) {
        const errText = await res.text();
        console.error("LWA token exchange failed:", res.status, errText);
        throw new Error(`LWA token exchange failed: ${res.status} — ${errText}`);
    }

    const data: LwaTokenResponse = await res.json();
    return data.access_token;
}

// ─── MCF Fulfillment Order ─────────────────────────────────────────
// Submit a Multi-Channel Fulfillment order to Amazon using the
// Fulfillment Outbound API.
// ────────────────────────────────────────────────────────────────────

interface McfAddress {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    stateOrRegion: string;
    postalCode: string;
    countryCode: string;
}

interface McfItem {
    sellerSku: string;
    sellerFulfillmentOrderItemId: string;
    quantity: number;
}

interface CreateMcfOrderRequest {
    orderId: string;
    address: McfAddress;
    items: McfItem[];
    shippingSpeed?: "Standard" | "Expedited" | "Priority";
    displayableComment?: string;
}

async function createFulfillmentOrder(
    accessToken: string,
    req: CreateMcfOrderRequest
): Promise<{ success: boolean; error?: string }> {
    const marketplace = Deno.env.get("AMAZON_MARKETPLACE_ID") || "ATVPDKIKX0DER"; // US marketplace default

    const now = new Date();
    const displayableDate = now.toISOString();

    const body = {
        sellerFulfillmentOrderId: req.orderId,
        displayableOrderId: req.orderId,
        displayableOrderDate: displayableDate,
        displayableOrderComment: req.displayableComment || "Thank you for your Hwabelle order!",
        shippingSpeedCategory: req.shippingSpeed || "Standard",
        destinationAddress: {
            name: req.address.name,
            addressLine1: req.address.addressLine1,
            ...(req.address.addressLine2 ? { addressLine2: req.address.addressLine2 } : {}),
            city: req.address.city,
            stateOrProvinceCode: req.address.stateOrRegion,
            postalCode: req.address.postalCode,
            countryCode: req.address.countryCode,
        },
        items: req.items.map((item, idx) => ({
            sellerSku: item.sellerSku,
            sellerFulfillmentOrderItemId: item.sellerFulfillmentOrderItemId || `${req.orderId}-item-${idx + 1}`,
            quantity: item.quantity,
        })),
        marketplaceId: marketplace,
    };

    console.log("Submitting MCF fulfillment order:", JSON.stringify(body));

    const endpoint = "https://sellingpartnerapi-na.amazon.com";
    const res = await fetch(`${endpoint}/fba/outbound/2020-07-01/fulfillmentOrders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-amz-access-token": accessToken,
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errText = await res.text();
        console.error("MCF createFulfillmentOrder failed:", res.status, errText);
        return { success: false, error: `${res.status}: ${errText}` };
    }

    console.log("MCF fulfillment order created successfully for:", req.orderId);
    return { success: true };
}

// ─── MCF Order Status ──────────────────────────────────────────────
// Check the status of an existing MCF fulfillment order.
// ────────────────────────────────────────────────────────────────────

async function getFulfillmentOrderStatus(
    accessToken: string,
    sellerFulfillmentOrderId: string
): Promise<any> {
    const endpoint = "https://sellingpartnerapi-na.amazon.com";
    const res = await fetch(
        `${endpoint}/fba/outbound/2020-07-01/fulfillmentOrders/${sellerFulfillmentOrderId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-amz-access-token": accessToken,
            },
        }
    );

    if (!res.ok) {
        const errText = await res.text();
        console.error("MCF getFulfillmentOrder failed:", res.status, errText);
        throw new Error(`Failed to get fulfillment status: ${res.status}`);
    }

    return await res.json();
}

// ─── SKU Mapping ───────────────────────────────────────────────────
// Map Hwabelle product IDs to Amazon Seller SKUs. Update this mapping
// when new physical products are added.
// ────────────────────────────────────────────────────────────────────

const PRODUCT_SKU_MAP: Record<string, string> = {
    // Acrylic Flower Press Kit — ASIN: B0GFGY8DGW
    "flower-press-kit": Deno.env.get("AMAZON_SKU_FLOWER_PRESS") || "FPK-1-2026",
    // Add more physical product SKU mappings here as needed
};

function isPhysicalProduct(productId: string): boolean {
    return productId in PRODUCT_SKU_MAP;
}

// ─── Main Handler ──────────────────────────────────────────────────
// Supports two actions:
//   1. "create" — Submit an MCF fulfillment order
//   2. "status" — Check fulfillment order status
//
// Auth: INTERNAL CALLS ONLY.
// Caller must provide x-internal-secret header matching INTERNAL_FUNCTION_SECRET.
// External HTTP calls without the secret are rejected with 401.
// ────────────────────────────────────────────────────────────────────

// Rate limiter (60 req / min per IP)
const mcfRateLimitMap = new Map<string, { count: number; resetAt: number }>();
function isMcfRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = mcfRateLimitMap.get(ip);
    if (!entry || now > entry.resetAt) { mcfRateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 }); return false; }
    entry.count++;
    return entry.count > 60;
}

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    const t0 = Date.now();
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // ── Rate limit ──
    if (isMcfRateLimited(ip)) {
        console.warn(JSON.stringify({ function: "amazon-mcf", event: "rate_limited", ip, ts: new Date().toISOString() }));
        return new Response(JSON.stringify({ error: "Too many requests" }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    // ── Internal secret auth — mandatory for all calls ──
    // stripe-webhook passes this header via supabase.functions.invoke headers option.
    // Any external caller without the correct secret is rejected here.
    const internalSecret = Deno.env.get("INTERNAL_FUNCTION_SECRET");
    if (!internalSecret) {
        console.error(JSON.stringify({ function: "amazon-mcf", event: "startup_error", error: "INTERNAL_FUNCTION_SECRET not configured", ts: new Date().toISOString() }));
        return new Response(JSON.stringify({ error: "Function not configured" }), {
            status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const callerSecret = req.headers.get("x-internal-secret") || "";
    if (callerSecret !== internalSecret) {
        console.warn(JSON.stringify({ function: "amazon-mcf", event: "unauthorized", ip, ts: new Date().toISOString() }));
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    try {
        const body = await req.json();
        const { action } = body;

        const accessToken = await getAccessToken();

        // ── ACTION: create ──────────────────────────────────────
        if (action === "create") {
            const {
                orderId,       // Stripe session ID or internal order ID
                customerName,
                shippingAddress, // Stripe shipping_details.address format
                items,         // Array of { productId, quantity }
                shippingSpeed,
            } = body;

            if (!orderId || !shippingAddress || !items?.length) {
                return new Response(
                    JSON.stringify({ error: "Missing orderId, shippingAddress, or items" }),
                    { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
                );
            }

            // Filter to only physical items that have SKU mappings
            const physicalItems: McfItem[] = items
                .filter((item: any) => isPhysicalProduct(item.productId))
                .map((item: any) => ({
                    sellerSku: PRODUCT_SKU_MAP[item.productId],
                    sellerFulfillmentOrderItemId: `${orderId}-${item.productId}`,
                    quantity: item.quantity || 1,
                }));

            if (physicalItems.length === 0) {
                return new Response(
                    JSON.stringify({ message: "No physical items to fulfill — skipping MCF" }),
                    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
                );
            }

            // Build address from Stripe's shipping_details format
            const address: McfAddress = {
                name: customerName || shippingAddress.name || "Customer",
                addressLine1: shippingAddress.line1,
                addressLine2: shippingAddress.line2 || undefined,
                city: shippingAddress.city,
                stateOrRegion: shippingAddress.state,
                postalCode: shippingAddress.postal_code,
                countryCode: shippingAddress.country,
            };

            // Truncate the Stripe session ID to a max-length Amazon accepts (40 chars)
            const mcfOrderId = `HWB-${orderId.slice(-32)}`;

            const result = await createFulfillmentOrder(accessToken, {
                orderId: mcfOrderId,
                address,
                items: physicalItems,
                shippingSpeed: shippingSpeed || "Standard",
            });

            // Persist MCF status to the orders table
            const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
            const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
            const supabase = createClient(supabaseUrl, supabaseServiceKey);

            await supabase
                .from("orders")
                .update({
                    mcf_order_id: mcfOrderId,
                    mcf_status: result.success ? "submitted" : "failed",
                    mcf_error: result.error || null,
                })
                .eq("stripe_session_id", orderId);

            return new Response(JSON.stringify(result), {
                status: result.success ? 200 : 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // ── ACTION: status ──────────────────────────────────────
        if (action === "status") {
            const { mcfOrderId } = body;
            if (!mcfOrderId) {
                return new Response(
                    JSON.stringify({ error: "mcfOrderId is required" }),
                    { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
                );
            }

            const statusData = await getFulfillmentOrderStatus(accessToken, mcfOrderId);
            return new Response(JSON.stringify(statusData), {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        return new Response(
            JSON.stringify({ error: "Invalid action. Use 'create' or 'status'." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "MCF operation failed";
        console.error("amazon-mcf error:", message, error);
        return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
