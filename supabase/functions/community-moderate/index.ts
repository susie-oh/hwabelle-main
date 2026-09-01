import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendSesEmail } from "../_shared/ses.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = Deno.env.get("SITE_URL") || "https://hwabelle.shop";

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

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  const suffix = Math.random().toString(36).substring(2, 7);
  return `${base || "flower-creation"}-${suffix}`;
}

function generatePublicationEmail(pub: {
  project_title: string;
  public_display_name: string;
  slug: string;
}): { subject: string; html: string } {
  const creationUrl = `${SITE_URL}/community/${pub.slug}`;
  const sharePinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(creationUrl)}&description=${encodeURIComponent(pub.project_title)}`;
  const shareFbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(creationUrl)}`;

  const subject = `Your flowers are officially in bloom: "${pub.project_title}" 🌸`;
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Creation is in Bloom</title>
</head>
<body style="margin:0; padding:0; background-color:#faf8f5; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#2c2c2c;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#faf8f5; padding:30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:580px; background-color:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #ede7df; box-shadow:0 4px 12px rgba(0,0,0,0.03);">
          <tr>
            <td style="padding:32px 32px 20px; text-align:center; border-bottom:1px solid #f2ede6;">
              <h1 style="margin:0; font-family:Georgia, serif; font-size:24px; font-weight:normal; letter-spacing:2px; color:#1a1a1a; text-transform:uppercase;">HWABELLE</h1>
              <p style="margin:6px 0 0; font-size:12px; letter-spacing:1px; text-transform:uppercase; color:#888;">Hwabelle in Bloom Community</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 24px; text-align:center; background-color:#faf7f2;">
              <p style="margin:0 0 10px; font-size:14px; color:#666;">Hi ${pub.public_display_name},</p>
              <h2 style="margin:0 0 12px; font-family:Georgia, serif; font-size:26px; font-weight:normal; color:#1a1a1a;">
                Your flowers are officially in bloom
              </h2>
              <p style="margin:0; font-size:15px; line-height:1.6; color:#555;">
                Your creation <strong>"${pub.project_title}"</strong> has been approved and published in the Hwabelle in Bloom Community Gallery.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 24px; text-align:center;">
              <a href="${creationUrl}" target="_blank" style="display:inline-block; background-color:#1a1a1a; color:#ffffff; font-size:15px; font-weight:500; text-decoration:none; padding:14px 28px; border-radius:4px; letter-spacing:0.5px; margin-bottom:24px;">
                View Your Live Feature →
              </a>
              <p style="margin:0 0 16px; font-size:13px; color:#777; text-transform:uppercase; letter-spacing:1px;">Share with your friends & family</p>
              <table align="center" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:0 8px;">
                    <a href="${sharePinterestUrl}" target="_blank" style="color:#bd081c; text-decoration:none; font-size:14px; font-weight:500; padding:6px 12px; border:1px solid #ede7df; border-radius:4px; display:inline-block;">Pinterest</a>
                  </td>
                  <td style="padding:0 8px;">
                    <a href="${shareFbUrl}" target="_blank" style="color:#1877f2; text-decoration:none; font-size:14px; font-weight:500; padding:6px 12px; border:1px solid #ede7df; border-radius:4px; display:inline-block;">Facebook</a>
                  </td>
                  <td style="padding:0 8px;">
                    <a href="${creationUrl}" target="_blank" style="color:#1a1a1a; text-decoration:none; font-size:14px; font-weight:500; padding:6px 12px; border:1px solid #ede7df; border-radius:4px; display:inline-block;">Copy Link</a>
                  </td>
                </tr>
              </table>
              <div style="margin-top:32px; padding-top:24px; border-top:1px solid #f2ede6;">
                <p style="margin:0; font-size:14px; color:#666;">
                  Working on your next floral preservation? You can submit anytime at <a href="${SITE_URL}/community/submit" style="color:#1a1a1a; font-weight:500;">hwabelle.shop/community/submit</a>.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px; background-color:#faf7f2; text-align:center; border-top:1px solid #ede7df; font-size:12px; color:#999;">
              <p style="margin:0;">Hwabelle Botanical Art & Keepsake Preservation · <a href="${SITE_URL}" style="color:#666;">hwabelle.shop</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
  return { subject, html };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return err("Method not allowed.", 405);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return err("Unauthorized: missing authorization header.", 401);
  }

  const supabaseUrl = getEnv("SUPABASE_URL");
  const supabaseServiceKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  // Validate user JWT
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !user) {
    return err("Unauthorized: invalid session.", 401);
  }

  // Check roles in DB (admin or moderator)
  const { data: userRoleData } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);

  const roles = (userRoleData || []).map((r) => r.role);
  const isAdmin = roles.includes("admin");
  const isModerator = roles.includes("moderator") || isAdmin;

  if (!isModerator) {
    return err("Forbidden: administrative or moderator role required.", 403);
  }

  let body: Record<string, any>;
  try {
    body = await req.json();
  } catch {
    return err("Invalid JSON payload.");
  }

  const { action, submission_id, publication_id } = body;
  if (!action) {
    return err("Action is required.");
  }

  try {
    // ── 1. GET QUEUE ─────────────────────────────────────────────────────────
    if (action === "get_queue") {
      const statusFilter = body.status;
      const categoryFilter = body.category;
      const page = Number(body.page) || 1;
      const limit = Number(body.limit) || 25;
      const offset = (page - 1) * limit;

      let query = supabaseAdmin
        .from("community_submissions")
        .select(`
          id, first_name, email, social_handle, project_title,
          category, stage, flowers_used, moderation_status,
          rights_confirmed, feature_permission, social_tag_permission,
          created_at, updated_at,
          community_submission_media(id, media_type, private_storage_path, mime_type, byte_size, sort_order)
        `, { count: "exact" });

      if (statusFilter && statusFilter !== "all") {
        query = query.eq("moderation_status", statusFilter);
      }
      if (categoryFilter && categoryFilter !== "all") {
        query = query.eq("category", categoryFilter);
      }

      query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);
      const { data, count, error } = await query;
      if (error) throw error;

      return json({ submissions: data, total: count, page, limit });
    }

    // ── 2. GET DETAIL ────────────────────────────────────────────────────────
    if (action === "get_detail") {
      if (!submission_id) return err("submission_id required.");

      const { data: submission, error: subErr } = await supabaseAdmin
        .from("community_submissions")
        .select(`
          *,
          community_submission_media(*)
        `)
        .eq("id", submission_id)
        .single();

      if (subErr || !submission) return err("Submission not found.", 404);

      // Get publication draft if any
      const { data: publication } = await supabaseAdmin
        .from("community_publications")
        .select(`
          *,
          community_publication_media(*)
        `)
        .eq("submission_id", submission_id)
        .maybeSingle();

      // Get moderation events
      const { data: events } = await supabaseAdmin
        .from("community_moderation_events")
        .select("*")
        .eq("submission_id", submission_id)
        .order("created_at", { ascending: false });

      // Generate signed URLs for private ingestion media preview
      const mediaWithUrls = await Promise.all(
        (submission.community_submission_media || []).map(async (m: any) => {
          const { data: signed } = await supabaseAdmin
            .storage
            .from("community-ingestion")
            .createSignedUrl(m.private_storage_path, 3600);
          return {
            ...m,
            preview_url: signed?.signedUrl || null,
          };
        })
      );

      return json({
        submission: { ...submission, community_submission_media: mediaWithUrls },
        publication,
        events: events || [],
        user_role: isAdmin ? "admin" : "moderator",
      });
    }

    // ── 3. APPROVE ───────────────────────────────────────────────────────────
    if (action === "approve") {
      if (!submission_id) return err("submission_id required.");

      const { data: submission, error: subErr } = await supabaseAdmin
        .from("community_submissions")
        .select("*, community_submission_media(*)")
        .eq("id", submission_id)
        .single();

      if (subErr || !submission) return err("Submission not found.", 404);

      const hasVideo = (submission.community_submission_media || []).some(
        (m: any) => m.media_type === "video"
      );

      // Copy media files to public 'community-media' bucket
      const pubMediaInserts: any[] = [];
      let primaryImagePath: string | null = null;

      for (const m of submission.community_submission_media || []) {
        const publicPath = `pub/${submission.id}/${m.id}.${m.private_storage_path.split(".").pop()}`;

        // Download from private ingestion
        const { data: fileData, error: dlErr } = await supabaseAdmin
          .storage
          .from("community-ingestion")
          .download(m.private_storage_path);

        if (!dlErr && fileData) {
          // Upload to public media bucket
          await supabaseAdmin
            .storage
            .from("community-media")
            .upload(publicPath, fileData, {
              contentType: m.mime_type,
              upsert: true,
            });
        }

        if (m.media_type === "image" && !primaryImagePath) {
          primaryImagePath = publicPath;
        }

        pubMediaInserts.push({
          media_type: m.media_type,
          public_storage_path: publicPath,
          alt_text: `${submission.project_title} - ${submission.category}`,
          sort_order: m.sort_order,
          is_primary: m.sort_order === 0,
        });
      }

      // Check if publication already exists or create new
      const existingSlug = generateSlug(submission.project_title);
      const { data: publication, error: pubErr } = await supabaseAdmin
        .from("community_publications")
        .upsert(
          {
            submission_id: submission.id,
            slug: existingSlug,
            public_display_name: submission.first_name,
            approved_social_handle: submission.social_tag_permission ? submission.social_handle : null,
            project_title: submission.project_title,
            category: submission.category,
            stage: submission.stage,
            flowers_used: submission.flowers_used,
            edited_story: submission.original_story,
            source_type: body.source_type || "customer_submission",
            verified_hwabelle_customer: !!submission.order_reference,
            has_video: hasVideo,
            video_caption_provided: false,
            publication_status: "draft",
            seo_title: `${submission.project_title} | Hwabelle in Bloom`,
            seo_description: `${submission.original_story.slice(0, 150)}...`,
            og_image_path: primaryImagePath,
          },
          { onConflict: "submission_id" }
        )
        .select()
        .single();

      if (pubErr || !publication) {
        console.error("Publication creation error:", pubErr);
        throw pubErr;
      }

      // Insert publication media entries
      if (pubMediaInserts.length > 0) {
        await supabaseAdmin
          .from("community_publication_media")
          .delete()
          .eq("publication_id", publication.id);

        const mediaWithPubId = pubMediaInserts.map((pm) => ({
          ...pm,
          publication_id: publication.id,
        }));
        await supabaseAdmin.from("community_publication_media").insert(mediaWithPubId);
      }

      // Update submission status to approved
      await supabaseAdmin
        .from("community_submissions")
        .update({ moderation_status: "approved", updated_at: new Date().toISOString() })
        .eq("id", submission_id);

      // Audit log
      await supabaseAdmin.from("community_moderation_events").insert({
        submission_id,
        publication_id: publication.id,
        actor_id: user.id,
        action: "approved",
        previous_status: submission.moderation_status,
        new_status: "approved",
        notes: body.notes || "Submission approved and publication draft prepared.",
      });

      return json({ success: true, publication });
    }

    // ── 4. REJECT ────────────────────────────────────────────────────────────
    if (action === "reject") {
      if (!submission_id) return err("submission_id required.");

      const { data: submission } = await supabaseAdmin
        .from("community_submissions")
        .select("moderation_status")
        .eq("id", submission_id)
        .single();

      await supabaseAdmin
        .from("community_submissions")
        .update({ moderation_status: "rejected", updated_at: new Date().toISOString() })
        .eq("id", submission_id);

      await supabaseAdmin.from("community_moderation_events").insert({
        submission_id,
        actor_id: user.id,
        action: "rejected",
        previous_status: submission?.moderation_status,
        new_status: "rejected",
        notes: body.notes || "Submission rejected by moderator.",
      });

      return json({ success: true });
    }

    // ── 5. REQUEST CHANGES ───────────────────────────────────────────────────
    if (action === "request_changes") {
      if (!submission_id) return err("submission_id required.");

      const { data: submission } = await supabaseAdmin
        .from("community_submissions")
        .select("moderation_status")
        .eq("id", submission_id)
        .single();

      await supabaseAdmin
        .from("community_submissions")
        .update({ moderation_status: "changes_requested", updated_at: new Date().toISOString() })
        .eq("id", submission_id);

      await supabaseAdmin.from("community_moderation_events").insert({
        submission_id,
        actor_id: user.id,
        action: "changes_requested",
        previous_status: submission?.moderation_status,
        new_status: "changes_requested",
        notes: body.notes || "Changes requested.",
      });

      return json({ success: true });
    }

    // ── 6. EDIT PUBLICATION (Sanitized public copy) ──────────────────────────
    if (action === "edit_publication") {
      if (!publication_id) return err("publication_id required.");

      const {
        public_display_name,
        approved_social_handle,
        project_title,
        category,
        stage,
        flowers_used,
        edited_story,
        related_resource_slug,
        related_product_url,
        seo_title,
        seo_description,
        source_type,
        video_caption_provided,
        media_items, // array of { id, alt_text, caption, transcript, poster_path, is_primary }
      } = body;

      const { data: updatedPub, error: updateErr } = await supabaseAdmin
        .from("community_publications")
        .update({
          public_display_name: public_display_name?.trim(),
          approved_social_handle: approved_social_handle?.trim() || null,
          project_title: project_title?.trim(),
          category,
          stage,
          flowers_used: flowers_used?.trim() || null,
          edited_story: edited_story?.trim(),
          related_resource_slug: related_resource_slug?.trim() || null,
          related_product_url: related_product_url?.trim() || null,
          seo_title: seo_title?.trim() || null,
          seo_description: seo_description?.trim() || null,
          source_type: source_type || "customer_submission",
          video_caption_provided: !!video_caption_provided,
          updated_at: new Date().toISOString(),
        })
        .eq("id", publication_id)
        .select()
        .single();

      if (updateErr) throw updateErr;

      // Update media items alt text / captions
      if (Array.isArray(media_items)) {
        for (const item of media_items) {
          if (item.id) {
            await supabaseAdmin
              .from("community_publication_media")
              .update({
                alt_text: item.alt_text?.trim() || "",
                caption: item.caption?.trim() || null,
                transcript: item.transcript?.trim() || null,
                poster_path: item.poster_path || null,
                is_primary: !!item.is_primary,
              })
              .eq("id", item.id);
          }
        }
      }

      await supabaseAdmin.from("community_moderation_events").insert({
        publication_id,
        actor_id: user.id,
        action: "edited_public_copy",
        notes: "Updated sanitized public publication copy.",
      });

      return json({ success: true, publication: updatedPub });
    }

    // ── 7. PUBLISH (Admin only) ──────────────────────────────────────────────
    if (action === "publish") {
      if (!isAdmin) {
        return err("Forbidden: publishing requires administrator role.", 403);
      }
      if (!publication_id) return err("publication_id required.");

      const { data: pub, error: pubErr } = await supabaseAdmin
        .from("community_publications")
        .select("*, community_submissions(id, email, first_name)")
        .eq("id", publication_id)
        .single();

      if (pubErr || !pub) return err("Publication not found.", 404);

      if (pub.has_video && !pub.video_caption_provided) {
        return err("Cannot publish video creation without captions/transcript provided for accessibility.");
      }

      const publishedAt = new Date().toISOString();

      await supabaseAdmin
        .from("community_publications")
        .update({
          publication_status: "published",
          published_at: publishedAt,
          archived_at: null,
          updated_at: publishedAt,
        })
        .eq("id", publication_id);

      if (pub.submission_id) {
        await supabaseAdmin
          .from("community_submissions")
          .update({ moderation_status: "published", updated_at: publishedAt })
          .eq("id", pub.submission_id);
      }

      await supabaseAdmin.from("community_moderation_events").insert({
        submission_id: pub.submission_id,
        publication_id,
        actor_id: user.id,
        action: "published",
        previous_status: pub.publication_status,
        new_status: "published",
        notes: "Live publication published.",
      });

      // Send creator publication email (non-blocking)
      const creatorEmail = pub.community_submissions?.email;
      if (creatorEmail) {
        try {
          const emailContent = generatePublicationEmail({
            project_title: pub.project_title,
            public_display_name: pub.public_display_name,
            slug: pub.slug,
          });

          await sendSesEmail({
            to: creatorEmail,
            subject: emailContent.subject,
            html: emailContent.html,
          });
        } catch (mailErr) {
          console.warn("Creator publication notification email error:", mailErr);
        }
      }

      return json({ success: true, published_at: publishedAt, slug: pub.slug });
    }

    // ── 8. UNPUBLISH / ARCHIVE (Admin only) ──────────────────────────────────
    if (action === "archive" || action === "unpublish") {
      if (!isAdmin) {
        return err("Forbidden: unpublishing/archiving requires administrator role.", 403);
      }
      if (!publication_id) return err("publication_id required.");

      const archivedAt = new Date().toISOString();

      const { data: pub } = await supabaseAdmin
        .from("community_publications")
        .update({
          publication_status: "archived",
          archived_at: archivedAt,
          featured: false,
          updated_at: archivedAt,
        })
        .eq("id", publication_id)
        .select("submission_id")
        .single();

      if (pub?.submission_id) {
        await supabaseAdmin
          .from("community_submissions")
          .update({ moderation_status: "archived", updated_at: archivedAt })
          .eq("id", pub.submission_id);
      }

      await supabaseAdmin.from("community_moderation_events").insert({
        submission_id: pub?.submission_id,
        publication_id,
        actor_id: user.id,
        action: "archived",
        previous_status: "published",
        new_status: "archived",
        notes: body.notes || "Publication archived/unpublished.",
      });

      return json({ success: true, archived_at: archivedAt });
    }

    // ── 9. FEATURE / UNFEATURE (Admin only) ──────────────────────────────────
    if (action === "feature" || action === "unfeature") {
      if (!isAdmin) {
        return err("Forbidden: featured status requires administrator role.", 403);
      }
      if (!publication_id) return err("publication_id required.");

      const isFeatured = action === "feature";

      await supabaseAdmin
        .from("community_publications")
        .update({ featured: isFeatured, updated_at: new Date().toISOString() })
        .eq("id", publication_id);

      await supabaseAdmin.from("community_moderation_events").insert({
        publication_id,
        actor_id: user.id,
        action: isFeatured ? "featured" : "unfeatured",
        notes: `Toggled featured to ${isFeatured}.`,
      });

      return json({ success: true, featured: isFeatured });
    }

    return err(`Unsupported action: ${action}`);
  } catch (e: any) {
    console.error(`[community-moderate ${action}] Exception:`, e);
    return err(e.message || "Internal server error", 500);
  }
});
