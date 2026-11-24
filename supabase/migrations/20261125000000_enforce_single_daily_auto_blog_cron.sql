-- Remove duplicate legacy MWF cron job so only one daily auto-blog schedule remains active
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'auto-blog-mwf') THEN
    PERFORM cron.unschedule('auto-blog-mwf');
  END IF;
END $$;
