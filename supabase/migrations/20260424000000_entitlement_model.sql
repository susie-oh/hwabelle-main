-- =============================================================================
-- Hwabelle Entitlement Model Migration
-- Phase 2: orders.user_id, order_number, order_items, entitlements, recovery_log
-- Applied: 2026-04-24
-- =============================================================================

-- ── 1. orders: add user_id (nullable FK to auth.users) ──────────────────────
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_orders_user_id
  ON public.orders(user_id) WHERE user_id IS NOT NULL;

-- ── 2. orders: add order_number ─────────────────────────────────────────────
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_number TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_number
  ON public.orders(order_number) WHERE order_number IS NOT NULL;

-- Auto-generate a human-readable order number on INSERT if not supplied.
-- Format: HW-YYYYMMDD-XXXXXX (6-char hex derived from UUID + timestamp).
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number :=
      'HW-' || TO_CHAR(NOW() AT TIME ZONE 'UTC', 'YYYYMMDD') || '-' ||
      UPPER(SUBSTRING(MD5(NEW.id::text || NOW()::text) FROM 1 FOR 6));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_order_number ON public.orders;
CREATE TRIGGER trg_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- ── 3. order_items ───────────────────────────────────────────────────────────
-- Normalized line items. Idempotency key: (order_id, stripe_line_item_id).
-- product_type is a stable slug set at checkout time, never derived from names.
CREATE TABLE IF NOT EXISTS public.order_items (
  id                  UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id            UUID        NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  stripe_line_item_id TEXT        NOT NULL,           -- Stripe line item ID (li_xxx) for idempotency
  stripe_price_id     TEXT,                           -- Stripe price ID if using Price objects
  product_name        TEXT        NOT NULL,
  product_type        TEXT        NOT NULL,            -- stable slug: 'ai-designer' | 'flower-press-kit' | 'other'
  unit_amount         INTEGER     NOT NULL,            -- in cents
  quantity            INTEGER     NOT NULL DEFAULT 1,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  -- Idempotency: one row per Stripe line item per order
  CONSTRAINT uq_order_items_line_item UNIQUE (order_id, stripe_line_item_id)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id
  ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_type
  ON public.order_items(product_type);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own order_items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins view all order_items" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- ── 4. entitlements ──────────────────────────────────────────────────────────
-- One row per order per product_type. user_id may be NULL if order was placed
-- before the user created an account (null is backfilled by get-entitlement
-- legacy recovery when the user authenticates with the matching verified email).
CREATE TABLE IF NOT EXISTS public.entitlements (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id     UUID        REFERENCES public.orders(id) ON DELETE SET NULL,
  product_type TEXT        NOT NULL DEFAULT 'ai-designer',
  source       TEXT        NOT NULL DEFAULT 'direct',  -- 'direct' | 'amazon' | 'gift' | 'admin'
  status       TEXT        NOT NULL DEFAULT 'active',  -- 'active' | 'expired' | 'revoked'
  expires_at   TIMESTAMPTZ,                            -- NULL = lifetime (one-time purchase)
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT chk_entitlement_status CHECK (status IN ('active','expired','revoked')),
  CONSTRAINT chk_entitlement_source CHECK (source IN ('direct','amazon','gift','admin')),
  -- One entitlement record per order per product (webhook idempotency).
  -- A repeat purchase creates a new order but cannot create a second entitlement
  -- for the same order_id + product_type combination.
  CONSTRAINT uq_entitlement_order_product UNIQUE (order_id, product_type)
);

CREATE INDEX IF NOT EXISTS idx_entitlements_user_id
  ON public.entitlements(user_id);
-- Covering index for the common read path: "does user X have active ai-designer access?"
CREATE INDEX IF NOT EXISTS idx_entitlements_active_lookup
  ON public.entitlements(user_id, product_type, status)
  WHERE status = 'active';

ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own entitlements" ON public.entitlements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins view all entitlements" ON public.entitlements
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE OR REPLACE FUNCTION update_entitlements_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_entitlements_updated_at ON public.entitlements;
CREATE TRIGGER trg_entitlements_updated_at
  BEFORE UPDATE ON public.entitlements
  FOR EACH ROW EXECUTE FUNCTION update_entitlements_updated_at();

-- ── 5. entitlement_recovery_log ─────────────────────────────────────────────
-- Audit trail for legacy email-based entitlement recovery.
-- Written when get-entitlement backfills an old guest-checkout customer.
CREATE TABLE IF NOT EXISTS public.entitlement_recovery_log (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email          TEXT        NOT NULL,
  order_ids      UUID[]      NOT NULL DEFAULT '{}',
  recovered_at   TIMESTAMPTZ DEFAULT NOW(),
  trigger_source TEXT        NOT NULL DEFAULT 'get-entitlement'
);

ALTER TABLE public.entitlement_recovery_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view recovery log" ON public.entitlement_recovery_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- ── 6. orders: users self-read RLS (safe, idempotent) ───────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'orders' AND policyname = 'Users view own orders'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Users view own orders" ON public.orders
        FOR SELECT USING (auth.uid() = user_id)
    $policy$;
  END IF;
END $$;
