-- Force confirm all unconfirmed users for local testing
UPDATE auth.users 
SET email_confirmed_at = now() 
WHERE email_confirmed_at IS NULL;
