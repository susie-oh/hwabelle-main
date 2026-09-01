# Hwabelle in Bloom Community UGC — Architecture & Data Privacy

## Overview
The "Hwabelle in Bloom" Community UGC system provides an end-to-end permission-based flywheel where customers submit botanical keepsakes, moderators curate and prepare sanitized public copies, and approved creations are published with permanent SEO URLs, social sharing tools, and product cross-links.

---

## 1. Data Privacy & Database Architecture

A strict boundary separates private submission data from public gallery records.

### Private Ingestion Domain (Never Publicly Accessible)
1. **`community_submissions`**:
   - Holds submitter PII (`first_name`, `email`, `social_handle`, `order_reference`), original story, and auditable consent records (`rights_confirmed`, `feature_permission`, `social_tag_permission`, `consent_version`, `consent_timestamp`).
   - RLS strictly denies all anonymous access (`anon` role).
   - Only accessible via backend Edge Functions using `service_role` and by authenticated users with `admin` or `moderator` roles.
2. **`community_submission_media`**:
   - Stores raw upload paths in the private `community-ingestion` storage bucket.
   - Raw filenames and private storage paths are never returned to public queries.
3. **`community-ingestion` Storage Bucket**:
   - Private bucket (`public = false`). Direct browser downloads blocked.

### Public Served Domain (CDN & RLS Accessible)
1. **`community_publications`**:
   - Sanitized public copy edited and approved by moderators (`public_display_name`, `approved_social_handle`, `project_title`, `category`, `stage`, `flowers_used`, `edited_story`, `source_type`, `verified_hwabelle_customer`, `seo_title`, `seo_description`).
   - Does NOT contain emails, order references, or private upload identifiers.
   - RLS allows public `SELECT` queries ONLY when `publication_status = 'published'`.
2. **`community_publication_media`**:
   - Stores public CDN paths in the `community-media` bucket (`public = true`).
   - RLS allows public `SELECT` only for media associated with published creations.
3. **`community-media` Storage Bucket**:
   - Public CDN bucket. Objects are only copied here upon moderation approval/publication.

### Audit Domain
1. **`community_moderation_events`**:
   - Immutable audit log capturing `submission_id`, `publication_id`, `actor_id`, `action`, `previous_status`, `new_status`, `notes`, and `created_at`.
   - Accessible only by admins and moderators.

---

## 2. Staged Upload Pipeline

To avoid proxying large media files through serverless memory limits, uploads follow a secure staged direct-to-storage architecture:

```
[Browser]                     [Edge Function: community-submit]           [Supabase Storage: community-ingestion]
   |                                          |                                              |
   |-- 1. POST action="init" + metadata ----->|                                              |
   |   (name, email, story, media specs)     |-- 2. Validate metadata & anti-abuse          |
   |                                          |-- 3. Create submission (status='received')   |
   |                                          |-- 4. Generate signed upload URLs ----------->|
   |<-- 5. Return upload session & signed URLs|                                              |
   |                                                                                         |
   |-- 6. PUT media directly to signed storage URLs with progress events ------------------->|
   |                                                                                         |
   |-- 7. POST action="finalize" ------------>|                                              |
   |                                          |-- 8. Verify objects exist in storage -------->|
   |                                          |-- 9. Insert community_submission_media       |
   |                                          |-- 10. Update status to 'pending_review'      |
   |<-- 11. Return success confirmation ------|                                              |
```

---

## 3. Moderation State Machine

Allowed state transitions are strictly governed:

```
received
   ↓ (upload finalized)
pending_review
   ├──> approved (creates publication draft & copies media to public bucket)
   │       ├──> published (live in gallery & triggers creator email)
   │       │       └──> archived (unpublish)
   │       └──> rejected
   ├──> changes_requested ──> pending_review
   └──> rejected
```

---

## 4. Role-Based Access Control (RBAC)

1. **Public Visitor**:
   - Submit via `community-submit` endpoint.
   - Read published items from `community_publications` and `community_publication_media`.
   - Cannot read private submissions, emails, or moderation logs.
2. **Moderator**:
   - Inspect submissions and view private ingestion previews via signed URLs.
   - Edit sanitized public copy.
   - Approve, Request Changes, or Reject submissions.
3. **Admin**:
   - All moderator capabilities, PLUS:
   - Publish to live gallery.
   - Unpublish / Archive.
   - Toggle Featured status.
   - Process rights complaints and emergency withdrawals.
