-- Add MCF (Multi-Channel Fulfillment) tracking columns to the orders table
-- These columns track the Amazon fulfillment status for physical products

ALTER TABLE orders ADD COLUMN IF NOT EXISTS mcf_order_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS mcf_status TEXT DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS mcf_error TEXT DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS mcf_submitted_at TIMESTAMPTZ DEFAULT NULL;

-- Index for quick MCF status lookups
CREATE INDEX IF NOT EXISTS idx_orders_mcf_order_id ON orders(mcf_order_id) WHERE mcf_order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_mcf_status ON orders(mcf_status) WHERE mcf_status IS NOT NULL;

-- Add a trigger to auto-set mcf_submitted_at when mcf_status changes to 'submitted'
CREATE OR REPLACE FUNCTION update_mcf_submitted_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.mcf_status = 'submitted' AND (OLD.mcf_status IS DISTINCT FROM 'submitted') THEN
        NEW.mcf_submitted_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_mcf_submitted_at ON orders;
CREATE TRIGGER trg_mcf_submitted_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_mcf_submitted_at();
