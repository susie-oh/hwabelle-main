-- =============================================================================
-- Hwabelle: Targeted user-by-email lookup for stripe-webhook
-- Replaces auth.admin.listUsers() which has a 1,000 user pagination ceiling.
-- Applied: 2026-04-24
-- =============================================================================

-- SECURITY DEFINER so the function can read auth.users regardless of RLS.
-- Only callable by the service role (stripe-webhook uses service role client).
CREATE OR REPLACE FUNCTION public.get_verified_user_id_by_email(p_email TEXT)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT id
    FROM auth.users
    WHERE LOWER(email) = LOWER(p_email)
      AND email_confirmed_at IS NOT NULL
    LIMIT 1;
$$;

-- Restrict execution to authenticated callers (service role passes this).
REVOKE ALL ON FUNCTION public.get_verified_user_id_by_email(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_verified_user_id_by_email(TEXT) TO service_role;
