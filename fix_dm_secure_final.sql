-- Final Secure Fix for DM Creation
-- Use a new function name 'create_dm_secure' to ensure clean execution.
-- Explicitly generates UUID to avoid RETURNING clause issues with RLS.

CREATE OR REPLACE FUNCTION public.create_dm_secure(target_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER -- Critical: Runs as superuser to bypass RLS
SET search_path = public
AS $$
DECLARE
  new_channel_id UUID;
  current_user_id UUID := auth.uid();
BEGIN
  -- 1. Validate input
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF current_user_id = target_user_id THEN
    RAISE EXCEPTION 'Cannot chat with yourself';
  END IF;

  -- 2. Check for existing DM
  SELECT c.id INTO new_channel_id
  FROM public.channels c
  JOIN public.channel_members cm1 ON c.id = cm1.channel_id
  JOIN public.channel_members cm2 ON c.id = cm2.channel_id
  WHERE c.type = 'dm'
    AND cm1.user_id = current_user_id
    AND cm2.user_id = target_user_id
  LIMIT 1;

  IF new_channel_id IS NOT NULL THEN
    RETURN new_channel_id;
  END IF;

  -- 3. Create New DM
  -- Generate ID beforehand to avoid using RETURNING clause which can sometimes trigger RLS checks
  new_channel_id := gen_random_uuid();

  -- Insert the channel
  INSERT INTO public.channels (id, type)
  VALUES (new_channel_id, 'dm');

  -- Insert the members
  INSERT INTO public.channel_members (channel_id, user_id)
  VALUES 
    (new_channel_id, current_user_id),
    (new_channel_id, target_user_id);

  RETURN new_channel_id;
END;
$$;
