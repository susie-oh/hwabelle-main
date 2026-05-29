-- Unconfirm the testing user to allow triggering a confirmation link
UPDATE auth.users
SET email_confirmed_at = NULL
WHERE email = 'ivllnv.000@gmail.com';
