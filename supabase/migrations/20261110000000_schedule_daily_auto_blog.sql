-- Schedule Daily Auto-Blog SEO & AEO Content Engine for Hwabelle (hwabelle.shop)
-- Runs every day at 01:00 UTC (9:00 AM PHT)

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'hwabelle-daily-auto-blog') THEN
    PERFORM cron.unschedule('hwabelle-daily-auto-blog');
  END IF;
END $$;

SELECT cron.schedule(
  'hwabelle-daily-auto-blog',
  '0 1 * * *',
  $$
  SELECT net.http_post(
    url := 'https://ryeviupygrrmoyxoycwl.supabase.co/functions/v1/auto-blog',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-trigger', 'true'
    ),
    body := '{"source": "pg_cron_daily", "force": true}'::jsonb,
    timeout_milliseconds := 120000
  ) AS request_id;
  $$
);

