import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── Constants ─────────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CONSENT_VERSION = "ugc-v1-2026-09";
const UPLOAD_SESSION_TTL_MINUTES = 120;

// File limits (enforced server-side; client validation is convenience only)
const MAX_IMAGES = 5;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;   // 10 MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;   // 100 MB
const ALLOWED_IMAGE_MIMES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_VIDEO_MIMES = new Set(["video/mp4"]);
const ALLOWED_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png":  "png",
  "image/webp": "webp",
  "video/mp4":  "mp4",
};

// Rate limiting: max 3 submissions per 10 minutes per identifier
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MINUTES = 10;

// Valid enum values (must match migration)
const VALID_CATEGORIES = new Set([
  "weddings", "garden_flowers", "gifts_memorials", "unboxing",
  "before_after", "in_progress", "finished_piece", "other",
]);
const VALID_STAGES = new Set([
  "unboxing", "in_progress", "finished", "before_after",
]);

// ── Types ──────────────────────────────────────────────────────────────────────

interface MediaSpec {
  mime_type: string;
  byte_size: number;
  width?: number;
  height?: number;
  duration_seconds?: number;
}

interface InitPayload {
  action: "init";
  first_name: string;
  email: string;
  social_handle?: string;
  project_title: string;
  category: string;
  stage: string;
  flowers_used?: string;
  original_story: string;
  order_reference?: string;
  rights_confirmed: boolean;
  feature_permission: boolean;
  social_tag_permission?: boolean;
  honeypot?: string; // must be empty
  media_specs: MediaSpec[]; // declared media before upload
  client_metadata?: { utm_source?: string; utm_medium?: string; utm_campaign?: string; referrer?: string };
}

interface FinalizePayload {
  action: "finalize";
  submission_id: string;
  upload_session_id: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getEnv(key: string): string {
  const val = Deno.env.get(key);
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function err(message: string, status = 400): Response {
  return json({ error: message }, status);
}

function isValidEmail(email: string): boolean {
  if (!email || email.length > 320) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** SHA-256 hash for rate-limit identifier (never store raw IP) */
async function hashIdentifier(raw: string): Promise<string> {
  const today = new Date().toISOString().slice(0, 10); // date-scoped
  const data = new TextEncoder().encode(`${raw}|${today}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

/** Generate a safe storage object path the user cannot control */
function makeStoragePath(submissionId: string, mediaUuid: string, mime: string): string {
  const ext = ALLOWED_EXTENSIONS[mime] || "bin";
  return `${submissionId}/${mediaUuid}.${ext}`;
}

// ── Rate Limiting ─────────────────────────────────────────────────────────────

async function checkRateLimit(
  supabaseAdmin: ReturnType<typeof createClient>,
  identifierHash: string,
): Promise<boolean> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();

  const { data: existing } = await supabaseAdmin
    .from("community_rate_limit")
    .select("id, request_count")
    .eq("identifier_hash", identifierHash)
    .gte("window_start", windowStart)
    .order("window_start", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    if (existing.request_count >= RATE_LIMIT_MAX) return false; // rate limited
    await supabaseAdmin
      .from("community_rate_limit")
      .update({ request_count: existing.request_count + 1 })
      .eq("id", existing.id);
  } else {
    await supabaseAdmin
      .from("community_rate_limit")
      .insert({ identifier_hash: identifierHash, request_count: 1 });
  }
  return true;
}

// ── Media Validation ──────────────────────────────────────────────────────────

function validateMediaSpecs(specs: MediaSpec[]): string | null {
  if (!Array.isArray(specs) || specs.length === 0) {
    return "At least one media file is required.";
  }

  const hasVideo = specs.some(s => ALLOWED_VIDEO_MIMES.has(s.mime_type));
  const hasImage = specs.some(s => ALLOWED_IMAGE_MIMES.has(s.mime_type));

  if (hasVideo && hasImage) {
    return "Submit up to 5 images OR 1 video — not both.";
  }

  if (hasVideo && specs.length > 1) {
    return "Only one video may be submitted.";
  }

  if (!hasVideo && !hasImage) {
    return "Unsupported file type. Accepted: JPEG, PNG, WebP, or MP4.";
  }

  if (hasImage && specs.length > MAX_IMAGES) {
    return `A maximum of ${MAX_IMAGES} images may be submitted.`;
  }

  for (const spec of specs) {
    const isImg = ALLOWED_IMAGE_MIMES.has(spec.mime_type);
    const isVid = ALLOWED_VIDEO_MIMES.has(spec.mime_type);

    if (!isImg && !isVid) {
      return `Unsupported file type: ${spec.mime_type}`;
    }

    if (isImg && spec.byte_size > MAX_IMAGE_BYTES) {
      return `Image exceeds the 10 MB size limit.`;
    }

    if (isVid && spec.byte_size > MAX_VIDEO_BYTES) {
      return `Video exceeds the 100 MB size limit.`;
    }

    if (spec.byte_size <= 0) {
      return "File size must be greater than 0.";
    }
  }

  return null; // valid
}

// ── Action: INIT ──────────────────────────────────────────────────────────────

async function handleInit(
  payload: InitPayload,
  req: Request,
  supabaseAdmin: ReturnType<typeof createClient>,
): Promise<Response> {

  // ── Honeypot check (anti-bot)
  if (payload.honeypot && payload.honeypot.trim().length > 0) {
    // Silently accept to not tip off bots, but do not create a submission
    return json({ success: true, submission_id: crypto.randomUUID(), mock: true });
  }

  // ── Rate limiting
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const identifierHash = await hashIdentifier(clientIp);
  const allowed = await checkRateLimit(supabaseAdmin, identifierHash);
  if (!allowed) {
    return err("Too many submissions. Please wait a few minutes and try again.", 429);
  }

  // ── Validate required fields
  const { first_name, email, project_title, category, stage, original_story,
    rights_confirmed, feature_permission, media_specs } = payload;

  if (!first_name?.trim() || first_name.trim().length > 100) {
    return err("First name is required (max 100 characters).");
  }
  if (!isValidEmail(email?.trim())) {
    return err("A valid email address is required.");
  }
  if (!project_title?.trim() || project_title.trim().length > 200) {
    return err("Project title is required (max 200 characters).");
  }
  if (!VALID_CATEGORIES.has(category)) {
    return err("Please select a valid category.");
  }
  if (!VALID_STAGES.has(stage)) {
    return err("Please select a valid stage.");
  }
  if (!original_story?.trim() || original_story.trim().length < 10) {
    return err("Please share a short story (at least 10 characters).");
  }
  if (original_story.trim().length > 2000) {
    return err("Story must be 2000 characters or less.");
  }
  if (rights_confirmed !== true) {
    return err("You must confirm you have the rights to submit this content.");
  }
  if (feature_permission !== true) {
    return err("Feature permission is required to submit to the Hwabelle community gallery.");
  }

  // ── Validate media specs
  const mediaError = validateMediaSpecs(media_specs);
  if (mediaError) return err(mediaError);

  const hasVideo = media_specs.some(s => ALLOWED_VIDEO_MIMES.has(s.mime_type));

  // ── Create submission record
  const uploadSessionId = crypto.randomUUID();
  const uploadSessionExpires = new Date(Date.now() + UPLOAD_SESSION_TTL_MINUTES * 60 * 1000).toISOString();

  const { data: submission, error: submissionError } = await supabaseAdmin
    .from("community_submissions")
    .insert({
      first_name: first_name.trim(),
      email: email.trim().toLowerCase(),
      social_handle: payload.social_handle?.trim() || null,
      project_title: project_title.trim(),
      category,
      stage,
      flowers_used: payload.flowers_used?.trim() || null,
      original_story: original_story.trim(),
      order_reference: payload.order_reference?.trim() || null,
      rights_confirmed: true,
      feature_permission: true,
      social_tag_permission: payload.social_tag_permission === true,
      consent_version: CONSENT_VERSION,
      consent_timestamp: new Date().toISOString(),
      upload_session_id: uploadSessionId,
      upload_session_expires: uploadSessionExpires,
      upload_finalized: false,
      moderation_status: "received",
    })
    .select("id")
    .single();

  if (submissionError || !submission) {
    console.error("[community-submit init] DB insert error:", submissionError);
    return err("Failed to create submission. Please try again.", 500);
  }

  const submissionId = submission.id;

  // ── Generate signed upload URLs for each declared media file
  const authorizedPaths: Array<{
    media_uuid: string;
    storage_path: string;
    signed_url: string;
    mime_type: string;
    byte_size: number;
  }> = [];

  for (const spec of media_specs) {
    const mediaUuid = crypto.randomUUID();
    const storagePath = makeStoragePath(submissionId, mediaUuid, spec.mime_type);

    const { data: signedData, error: signedError } = await supabaseAdmin
      .storage
      .from("community-ingestion")
      .createSignedUploadUrl(storagePath, { upsert: false });

    if (signedError || !signedData) {
      console.error("[community-submit init] Signed URL error:", signedError);
      // Clean up submission on failure
      await supabaseAdmin.from("community_submissions").delete().eq("id", submissionId);
      return err("Failed to prepare upload. Please try again.", 500);
    }

    authorizedPaths.push({
      media_uuid: mediaUuid,
      storage_path: storagePath,
      signed_url: signedData.signedUrl,
      mime_type: spec.mime_type,
      byte_size: spec.byte_size,
    });
  }

  return json({
    success: true,
    submission_id: submissionId,
    upload_session_id: uploadSessionId,
    upload_session_expires: uploadSessionExpires,
    has_video: hasVideo,
    authorized_uploads: authorizedPaths.map(p => ({
      media_uuid: p.media_uuid,
      storage_path: p.storage_path,
      signed_url: p.signed_url,
      mime_type: p.mime_type,
      byte_size: p.byte_size,
    })),
  });
}

// ── Action: FINALIZE ──────────────────────────────────────────────────────────

async function handleFinalize(
  payload: FinalizePayload,
  supabaseAdmin: ReturnType<typeof createClient>,
): Promise<Response> {
  const { submission_id, upload_session_id } = payload;

  if (!submission_id || !upload_session_id) {
    return err("submission_id and upload_session_id are required.");
  }

  // ── Fetch submission and verify session
  const { data: submission, error: fetchError } = await supabaseAdmin
    .from("community_submissions")
    .select("id, upload_session_id, upload_session_expires, upload_finalized, moderation_status")
    .eq("id", submission_id)
    .single();

  if (fetchError || !submission) {
    return err("Submission not found.", 404);
  }

  if (submission.upload_session_id !== upload_session_id) {
    return err("Invalid upload session.", 403);
  }

  if (submission.upload_finalized) {
    return err("Submission already finalized.", 409);
  }

  if (new Date(submission.upload_session_expires) < new Date()) {
    return err("Upload session has expired. Please start a new submission.", 410);
  }

  // ── Verify that uploaded objects exist at the expected paths
  const { data: existingObjects, error: listError } = await supabaseAdmin
    .storage
    .from("community-ingestion")
    .list(submission_id, { limit: 10 });

  if (listError) {
    console.error("[community-submit finalize] Storage list error:", listError);
    return err("Could not verify uploaded media. Please try again.", 500);
  }

  if (!existingObjects || existingObjects.length === 0) {
    return err("No media files found. Please ensure your uploads completed successfully.");
  }

  // Verify counts: no extra objects beyond what was declared
  const hasVideo = existingObjects.some(o => o.name.endsWith(".mp4"));
  const hasImages = existingObjects.some(o =>
    o.name.endsWith(".jpg") || o.name.endsWith(".png") || o.name.endsWith(".webp")
  );

  if (hasVideo && hasImages) {
    return err("Invalid submission: mixed image and video uploads detected.");
  }
  if (hasImages && existingObjects.length > MAX_IMAGES) {
    return err(`Too many image files found (max ${MAX_IMAGES}).`);
  }
  if (hasVideo && existingObjects.length > 1) {
    return err("Only one video may be submitted.");
  }

  // ── Create community_submission_media records
  const mediaInserts = existingObjects.map((obj, idx) => {
    const storagePath = `${submission_id}/${obj.name}`;
    const isVideo = obj.name.endsWith(".mp4");
    const mime = isVideo ? "video/mp4"
      : obj.name.endsWith(".png") ? "image/png"
      : obj.name.endsWith(".webp") ? "image/webp"
      : "image/jpeg";

    return {
      submission_id,
      media_type: (isVideo ? "video" : "image") as "video" | "image",
      private_storage_path: storagePath,
      mime_type: mime,
      byte_size: obj.metadata?.size || 0,
      sort_order: idx,
      processing_status: "pending",
    };
  });

  const { error: mediaError } = await supabaseAdmin
    .from("community_submission_media")
    .insert(mediaInserts);

  if (mediaError) {
    console.error("[community-submit finalize] Media insert error:", mediaError);
    return err("Failed to record media. Please try again.", 500);
  }

  // ── Transition submission to pending_review and mark finalized
  const { error: updateError } = await supabaseAdmin
    .from("community_submissions")
    .update({
      upload_finalized: true,
      moderation_status: "pending_review",
      updated_at: new Date().toISOString(),
    })
    .eq("id", submission_id);

  if (updateError) {
    console.error("[community-submit finalize] Status update error:", updateError);
    return err("Failed to finalize submission. Please contact support.", 500);
  }

  // ── Log moderation event
  await supabaseAdmin
    .from("community_moderation_events")
    .insert({
      submission_id,
      action: "submission_received",
      previous_status: "received",
      new_status: "pending_review",
      notes: `Finalized with ${mediaInserts.length} media file(s).`,
    });

  return json({ success: true, message: "Your creation has been submitted and is awaiting review." });
}

// ── Main Handler ──────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return err("Method not allowed.", 405);
  }

  // Payload size guard (1 MB max for JSON metadata — no binary here)
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > 1_000_000) {
    return err("Payload too large.", 413);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return err("Invalid JSON body.");
  }

  const action = body.action as string;
  if (!action || !["init", "finalize"].includes(action)) {
    return err("action must be 'init' or 'finalize'.");
  }

  const supabaseAdmin = createClient(
    getEnv("SUPABASE_URL"),
    getEnv("SUPABASE_SERVICE_ROLE_KEY"),
  );

  try {
    if (action === "init") {
      return await handleInit(body as unknown as InitPayload, req, supabaseAdmin);
    } else {
      return await handleFinalize(body as unknown as FinalizePayload, supabaseAdmin);
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[community-submit ${action}] Unexpected error:`, message);
    return err("An unexpected error occurred. Please try again.", 500);
  }
});
