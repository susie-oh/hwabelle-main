# Hwabelle in Bloom — Media Specifications & Retention SOP

## 1. Supported Formats & Upload Limits

| Media Type | Allowed Formats / MIME | Max File Size | Maximum Files |
| :--- | :--- | :--- | :--- |
| **Photos** | JPEG (`image/jpeg`), PNG (`image/png`), WebP (`image/webp`) | 10 MB per image | Up to 5 photos |
| **Video** | MP4 (`video/mp4`) | 100 MB per video | Max 1 video |
| **Mixed Submissions** | Prohibited | N/A | Must be either photos OR video |

*Note: HEIC/HEIF formats are excluded from MVP due to cross-platform browser support limitations.*

---

## 2. Storage Buckets & Lifecycle

### Ingestion Bucket: `community-ingestion`
- **Visibility**: Private (`public = false`).
- **Access**: Only backend Edge Functions (`service_role`) and authenticated admin/moderators (via signed URLs).
- **Naming Convention**: `community-ingestion/{submission_id}/{media_uuid}.{ext}`.
- **Retention**: Raw files retained for auditable history.

### Public CDN Bucket: `community-media`
- **Visibility**: Public (`public = true`).
- **Access**: Worldwide via CDN.
- **Path Structure**: `community-media/pub/{submission_id}/{media_id}.{ext}`.
- **Ingestion**: Media is ONLY copied here upon moderation approval. Raw unapproved submissions are never in this bucket.

---

## 3. Video Accessibility Requirement (WCAG 2.2 AA)
- Autoplay with sound is strictly forbidden.
- Video players must provide user-initiated controls.
- Publication is blocked in the moderation interface until a transcript/caption record is provided.
