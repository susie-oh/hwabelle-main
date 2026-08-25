-- Flower Personality Quiz submissions table
-- Stores quiz leads and results for the "Find Your Flower" feature

CREATE TABLE IF NOT EXISTS public.flower_quiz_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  first_name TEXT,
  email TEXT,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  flower_result TEXT NOT NULL,
  answers JSONB,
  source TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  referrer TEXT,
  session_id UUID,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security — deny all direct browser access
-- Submissions are inserted through the flower-quiz-submit Edge Function
-- which uses the service_role key (bypasses RLS)
ALTER TABLE public.flower_quiz_submissions ENABLE ROW LEVEL SECURITY;

-- No SELECT/INSERT/UPDATE/DELETE policies for anon/authenticated roles
-- This means the browser cannot read or write this table directly

-- Indexes for admin queries
CREATE INDEX idx_flower_quiz_submissions_email ON public.flower_quiz_submissions (email);
CREATE INDEX idx_flower_quiz_submissions_created_at ON public.flower_quiz_submissions (created_at DESC);
CREATE INDEX idx_flower_quiz_submissions_flower_result ON public.flower_quiz_submissions (flower_result);
