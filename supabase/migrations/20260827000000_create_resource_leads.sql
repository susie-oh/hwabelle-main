-- Migration: Create resource_leads table for Educational Content & Lead Magnet Funnel
-- Provides secure lead capture with RLS enabled and strict database-level constraints

CREATE TABLE IF NOT EXISTS public.resource_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  email TEXT NOT NULL,
  first_name TEXT,
  resource_id TEXT NOT NULL,
  source_page TEXT,
  source_type TEXT,
  offer_trigger TEXT,
  resource_position TEXT,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  referrer TEXT,
  CONSTRAINT valid_resource_id CHECK (
    resource_id IN (
      'flower-pressing-guide',
      'flower-selection-guide',
      'quick-start-guide'
    )
  )
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.resource_leads ENABLE ROW LEVEL SECURITY;

-- Note: Anonymous users have ZERO direct insert/select access.
-- All lead submissions and guide claims must be processed through the secure resource-lead-submit Edge Function using service_role key.

-- Allow admins to read leads
CREATE POLICY "Admins can view resource leads"
  ON public.resource_leads
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Indexes for fast querying, deduplication, and CRM reporting
CREATE INDEX IF NOT EXISTS idx_resource_leads_email ON public.resource_leads (email);
CREATE INDEX IF NOT EXISTS idx_resource_leads_resource_id ON public.resource_leads (resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_leads_created_at ON public.resource_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resource_leads_email_resource ON public.resource_leads (email, resource_id);
