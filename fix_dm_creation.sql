-- Fix DM Creation Error by using a Secure RPC Function
-- This avoids the "new row violates RLS" error which happens because
-- users insert a channel but cannot 'SELECT' it immediately (as they aren't members yet).

CREATE OR REPLACE FUNCTION public.get_or_create_dm(target_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with system privileges, bypassing RLS during execution
SET search_path = public
AS $$
DECLARE
  channel_id_found UUID;
  current_user_id UUID := auth.uid();
BEGIN
  -- 0. Prevent self-chat
  IF current_user_id = target_user_id THEN
    RAISE EXCEPTION 'Cannot create DM with yourself';
  END IF;

  -- 1. Check if DM already exists between these two users
  -- We look for a channel of type 'dm' where both users are members.
  -- Note: This query logic assumes a DM has exactly 2 members.
  SELECT c.id INTO channel_id_found
  FROM public.channels c
  JOIN public.channel_members cm1 ON c.id = cm1.channel_id
  JOIN public.channel_members cm2 ON c.id = cm2.channel_id
  WHERE c.type = 'dm'
    AND cm1.user_id = current_user_id
    AND cm2.user_id = target_user_id
  LIMIT 1;

  IF channel_id_found IS NOT NULL THEN
    RETURN channel_id_found;
  END IF;

  -- 2. Create new DM Channel
  INSERT INTO public.channels (type)
  VALUES ('dm')
  RETURNING id INTO channel_id_found;

  -- 3. Add Members (Current User + Target User)
  INSERT INTO public.channel_members (channel_id, user_id)
  VALUES 
    (channel_id_found, current_user_id),
    (channel_id_found, target_user_id);

  RETURN channel_id_found;
END;
$$;
