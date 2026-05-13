-- Add admin role to the test accounts if they exist
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email IN ('admin@hwabelle.com', 'ivllnv.000@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;
