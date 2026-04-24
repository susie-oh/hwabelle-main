-- =============================================================================
-- Hwabelle Phase 2 Migration
-- 1. Backfill orders.order_number for existing rows
-- 2. Create access_requests redemption state table
-- Applied: 2026-04-25
-- =============================================================================

-- ── 1. Backfill existing order numbers ──────────────────────────────────────
-- Applies the same 6-char hex + date format used by the trigger.
UPDATE public.orders
SET order_number = 'HW-' || TO_CHAR(created_at AT TIME ZONE 'UTC', 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(id::text || created_at::text) FROM 1 FOR 6))
WHERE order_number IS NULL;

-- Ensure constraint is solid (the previous migration made it unique, but let's confirm NOT NULL if preferred.
-- We'll keep it nullable but unique just in case, per previous migration.)

-- ── 2. Create access_requests table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.access_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    order_number TEXT NOT NULL,
    email TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'website', -- 'website', 'amazon'
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'redeemed'
    redemption_count INTEGER NOT NULL DEFAULT 0,
    max_redemptions INTEGER NOT NULL DEFAULT 1,
    redeemed_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_access_requests_order UNIQUE (order_id),
    CONSTRAINT chk_access_requests_status CHECK (status IN ('pending', 'redeemed')),
    CONSTRAINT chk_access_requests_source CHECK (source IN ('website', 'amazon'))
);

CREATE INDEX IF NOT EXISTS idx_access_requests_order_number ON public.access_requests(order_number);
CREATE INDEX IF NOT EXISTS idx_access_requests_email ON public.access_requests(LOWER(email));

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_access_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_access_requests_updated_at ON public.access_requests;
CREATE TRIGGER trg_access_requests_updated_at
    BEFORE UPDATE ON public.access_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_access_requests_updated_at();

-- RLS: Admin-only access from client side. Edge functions bypass via service role.
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view access_requests" ON public.access_requests
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
    );
