-- Fix NULL email_change values in auth.users that cause scan errors
UPDATE auth.users 
SET email_change = '' 
WHERE email_change IS NULL;