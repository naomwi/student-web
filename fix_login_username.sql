-- Function to securely look up email by username
-- This is needed because 'profiles' table RLS might hide emails from public/anon users.
CREATE OR REPLACE FUNCTION public.get_email_by_username(username_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with privileges of the creator (bypass RLS)
SET search_path = public
AS $$
DECLARE
  found_email TEXT;
BEGIN
  SELECT email INTO found_email
  FROM public.profiles
  WHERE username = username_input;
  
  RETURN found_email;
END;
$$;
