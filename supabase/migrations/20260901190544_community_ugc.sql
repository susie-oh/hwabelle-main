-- =============================================================================
-- Hwabelle Community UGC System — Workstream C
-- Migration: community_ugc
-- =============================================================================

-- ── ENUMS (Idempotent creation) ──────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE public.community_moderation_status AS ENUM (
    'received',
    'pending_review',
    'changes_requested',
    'approved',
    'rejected',
    'published',
    'archived'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.community_publication_status AS ENUM (
    'draft',
    'published',
    'archived'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.community_media_type AS ENUM (
    'image',
    'video'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.community_category AS ENUM (
    'weddings',
    'garden_flowers',
    'gifts_memorials',
    'unboxing',
    'before_after',
    'in_progress',
    'finished_piece',
    'other'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.community_stage AS ENUM (
    'unboxing',
    'in_progress',
    'finished',
    'before_after'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ── PRIVATE: community_submissions ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.community_submissions (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name            TEXT        NOT NULL CHECK (char_length(first_name) BETWEEN 1 AND 100),
  email                 TEXT        NOT NULL CHECK (char_length(email) BETWEEN 3 AND 320),
  social_handle         TEXT        CHECK (char_length(social_handle) <= 100),
  project_title         TEXT        NOT NULL CHECK (char_length(project_title) BETWEEN 1 AND 200),
  category              public.community_category NOT NULL,
  stage                 public.community_stage NOT NULL,
  flowers_used          TEXT        CHECK (char_length(flowers_used) <= 500),
  original_story        TEXT        NOT NULL CHECK (char_length(original_story) BETWEEN 10 AND 2000),
  order_reference       TEXT        CHECK (char_length(order_reference) <= 100),
  rights_confirmed      BOOLEAN     NOT NULL DEFAULT false,
  feature_permission    BOOLEAN     NOT NULL DEFAULT false,
  social_tag_permission BOOLEAN     NOT NULL DEFAULT false,
  consent_version       TEXT        NOT NULL DEFAULT 'ugc-v1-2026-09',
  consent_timestamp     TIMESTAMPTZ NOT NULL DEFAULT now(),
  upload_session_id     UUID        NOT NULL DEFAULT gen_random_uuid(),
  upload_session_expires TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '2 hours'),
  upload_finalized      BOOLEAN     NOT NULL DEFAULT false,
  moderation_status     public.community_moderation_status NOT NULL DEFAULT 'received',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_submissions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_community_submissions_moderation_status
  ON public.community_submissions (moderation_status);
CREATE INDEX IF NOT EXISTS idx_community_submissions_created_at
  ON public.community_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_submissions_category
  ON public.community_submissions (category);
CREATE INDEX IF NOT EXISTS idx_community_submissions_upload_session
  ON public.community_submissions (upload_session_id, upload_session_expires);

-- RLS: Drop if exists before re-creating
DROP POLICY IF EXISTS "Admins can manage all submissions" ON public.community_submissions;
CREATE POLICY "Admins can manage all submissions"
  ON public.community_submissions
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Moderators can read and update submissions" ON public.community_submissions;
CREATE POLICY "Moderators can read and update submissions"
  ON public.community_submissions
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

-- ── PRIVATE: community_submission_media ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.community_submission_media (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id         UUID        NOT NULL REFERENCES public.community_submissions(id) ON DELETE CASCADE,
  media_type            public.community_media_type NOT NULL,
  private_storage_path  TEXT        NOT NULL,
  original_filename     TEXT,
  mime_type             TEXT        NOT NULL,
  byte_size             BIGINT      NOT NULL CHECK (byte_size > 0),
  width                 INTEGER     CHECK (width > 0),
  height                INTEGER     CHECK (height > 0),
  duration_seconds      NUMERIC     CHECK (duration_seconds > 0),
  sort_order            INTEGER     NOT NULL DEFAULT 0,
  processing_status     TEXT        NOT NULL DEFAULT 'pending'
                        CHECK (processing_status IN ('pending', 'processing', 'ready', 'failed')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_submission_media ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_community_submission_media_submission_id
  ON public.community_submission_media (submission_id);

DROP POLICY IF EXISTS "Admins can manage submission media" ON public.community_submission_media;
CREATE POLICY "Admins can manage submission media"
  ON public.community_submission_media
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Moderators can read submission media" ON public.community_submission_media;
CREATE POLICY "Moderators can read submission media"
  ON public.community_submission_media
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

-- ── PUBLIC: community_publications ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.community_publications (
  id                        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id             UUID        REFERENCES public.community_submissions(id) ON DELETE SET NULL,
  slug                      TEXT        UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' AND char_length(slug) BETWEEN 3 AND 120),
  public_display_name       TEXT        NOT NULL CHECK (char_length(public_display_name) BETWEEN 1 AND 100),
  approved_social_handle    TEXT        CHECK (char_length(approved_social_handle) <= 100),
  project_title             TEXT        NOT NULL CHECK (char_length(project_title) BETWEEN 1 AND 200),
  category                  public.community_category NOT NULL,
  stage                     public.community_stage NOT NULL,
  flowers_used              TEXT        CHECK (char_length(flowers_used) <= 500),
  edited_story              TEXT        NOT NULL CHECK (char_length(edited_story) BETWEEN 10 AND 2000),
  source_type               TEXT        NOT NULL DEFAULT 'customer_submission'
                            CHECK (source_type IN ('customer_submission', 'team_created', 'inspiration')),
  verified_hwabelle_customer BOOLEAN    NOT NULL DEFAULT false,
  related_resource_slug     TEXT,
  related_product_url       TEXT,
  has_video                 BOOLEAN     NOT NULL DEFAULT false,
  video_caption_provided    BOOLEAN     NOT NULL DEFAULT false,
  publication_status        public.community_publication_status NOT NULL DEFAULT 'draft',
  featured                  BOOLEAN     NOT NULL DEFAULT false,
  published_at              TIMESTAMPTZ,
  archived_at               TIMESTAMPTZ,
  seo_title                 TEXT        CHECK (char_length(seo_title) <= 70),
  seo_description           TEXT        CHECK (char_length(seo_description) <= 160),
  og_image_path             TEXT,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT video_requires_caption CHECK (
    NOT (has_video = true AND publication_status = 'published' AND video_caption_provided = false)
  )
);

ALTER TABLE public.community_publications ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_community_publications_publication_status
  ON public.community_publications (publication_status);
CREATE INDEX IF NOT EXISTS idx_community_publications_published_at
  ON public.community_publications (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_publications_featured
  ON public.community_publications (featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_community_publications_slug
  ON public.community_publications (slug);
CREATE INDEX IF NOT EXISTS idx_community_publications_category
  ON public.community_publications (category, publication_status);
CREATE INDEX IF NOT EXISTS idx_community_publications_submission_id
  ON public.community_publications (submission_id);

DROP POLICY IF EXISTS "Anyone can read published publications" ON public.community_publications;
CREATE POLICY "Anyone can read published publications"
  ON public.community_publications
  FOR SELECT
  USING (publication_status = 'published');

DROP POLICY IF EXISTS "Admins can manage all publications" ON public.community_publications;
CREATE POLICY "Admins can manage all publications"
  ON public.community_publications
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Moderators can read all publications" ON public.community_publications;
CREATE POLICY "Moderators can read all publications"
  ON public.community_publications
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

-- ── PUBLIC: community_publication_media ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.community_publication_media (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id        UUID        NOT NULL REFERENCES public.community_publications(id) ON DELETE CASCADE,
  media_type            public.community_media_type NOT NULL,
  public_storage_path   TEXT        NOT NULL,
  alt_text              TEXT        NOT NULL DEFAULT '' CHECK (char_length(alt_text) <= 500),
  caption               TEXT        CHECK (char_length(caption) <= 1000),
  poster_path           TEXT,
  transcript            TEXT,
  width                 INTEGER     CHECK (width > 0),
  height                INTEGER     CHECK (height > 0),
  sort_order            INTEGER     NOT NULL DEFAULT 0,
  is_primary            BOOLEAN     NOT NULL DEFAULT false,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_publication_media ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_community_publication_media_publication_id
  ON public.community_publication_media (publication_id, sort_order);

DROP POLICY IF EXISTS "Anyone can read media for published publications" ON public.community_publication_media;
CREATE POLICY "Anyone can read media for published publications"
  ON public.community_publication_media
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.community_publications p
      WHERE p.id = community_publication_media.publication_id
        AND p.publication_status = 'published'
    )
  );

DROP POLICY IF EXISTS "Admins can manage all publication media" ON public.community_publication_media;
CREATE POLICY "Admins can manage all publication media"
  ON public.community_publication_media
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Moderators can read and update publication media" ON public.community_publication_media;
CREATE POLICY "Moderators can read and update publication media"
  ON public.community_publication_media
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Moderators can update alt text and captions" ON public.community_publication_media;
CREATE POLICY "Moderators can update alt text and captions"
  ON public.community_publication_media
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

-- ── AUDIT: community_moderation_events ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.community_moderation_events (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id         UUID        REFERENCES public.community_submissions(id) ON DELETE SET NULL,
  publication_id        UUID        REFERENCES public.community_publications(id) ON DELETE SET NULL,
  actor_id              UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  action                TEXT        NOT NULL CHECK (char_length(action) BETWEEN 1 AND 100),
  previous_status       TEXT,
  new_status            TEXT,
  notes                 TEXT        CHECK (char_length(notes) <= 2000),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_moderation_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_community_moderation_events_submission_id
  ON public.community_moderation_events (submission_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_moderation_events_publication_id
  ON public.community_moderation_events (publication_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_moderation_events_actor_id
  ON public.community_moderation_events (actor_id);
CREATE INDEX IF NOT EXISTS idx_community_moderation_events_created_at
  ON public.community_moderation_events (created_at DESC);

DROP POLICY IF EXISTS "Admins and moderators can read moderation events" ON public.community_moderation_events;
CREATE POLICY "Admins and moderators can read moderation events"
  ON public.community_moderation_events
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- ── TRIGGERS ─────────────────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS update_community_submissions_updated_at ON public.community_submissions;
CREATE TRIGGER update_community_submissions_updated_at
  BEFORE UPDATE ON public.community_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_community_publications_updated_at ON public.community_publications;
CREATE TRIGGER update_community_publications_updated_at
  BEFORE UPDATE ON public.community_publications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ── ANTI-ABUSE: rate limiting table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.community_rate_limit (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier_hash       TEXT        NOT NULL,
  window_start          TIMESTAMPTZ NOT NULL DEFAULT now(),
  request_count         INTEGER     NOT NULL DEFAULT 1,
  UNIQUE (identifier_hash, window_start)
);

ALTER TABLE public.community_rate_limit ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_community_rate_limit_identifier
  ON public.community_rate_limit (identifier_hash, window_start DESC);

CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.community_rate_limit
  WHERE window_start < now() - INTERVAL '24 hours';
$$;

-- ── STORAGE BUCKETS ───────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'community-ingestion',
  'community-ingestion',
  false,
  104857600,
  ARRAY[
    'image/jpeg', 'image/png', 'image/webp',
    'video/mp4'
  ]
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'community-media',
  'community-media',
  true,
  104857600,
  ARRAY[
    'image/jpeg', 'image/png', 'image/webp',
    'video/mp4'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Service role only for ingestion bucket" ON storage.objects;
CREATE POLICY "Service role only for ingestion bucket"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'community-ingestion' AND false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "Public can read community media" ON storage.objects;
CREATE POLICY "Public can read community media"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'community-media');

DROP POLICY IF EXISTS "No direct browser writes to community-media" ON storage.objects;
CREATE POLICY "No direct browser writes to community-media"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (false);

-- ── HELPER FUNCTION: validate state transition ────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_valid_community_transition(
  _from public.community_moderation_status,
  _to   public.community_moderation_status
) RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN _from = 'received'          AND _to = 'pending_review'    THEN true
    WHEN _from = 'pending_review'    AND _to = 'approved'          THEN true
    WHEN _from = 'pending_review'    AND _to = 'rejected'          THEN true
    WHEN _from = 'pending_review'    AND _to = 'changes_requested' THEN true
    WHEN _from = 'changes_requested' AND _to = 'pending_review'    THEN true
    WHEN _from = 'approved'          AND _to = 'published'         THEN true
    WHEN _from = 'approved'          AND _to = 'rejected'          THEN true
    WHEN _from = 'published'         AND _to = 'archived'          THEN true
    WHEN _from = 'published'         AND _to = 'pending_review'    THEN true
    ELSE false
  END;
$$;
