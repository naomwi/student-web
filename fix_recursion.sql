-- Fix Infinite Recursion in RLS Policies

-- 1. Create a helper function to check channel membership bypassing RLS.
-- This is critical because checking membership by querying 'channel_members' 
-- inside a 'channel_members' policy causes an infinite loop.
-- SECURITY DEFINER ensures this runs with system privileges, bypassing the RLS on channel_members.
CREATE OR REPLACE FUNCTION public.is_channel_member(_channel_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.channel_members 
    WHERE channel_id = _channel_id 
    AND user_id = auth.uid()
  );
END;
$$;

-- 2. Update 'channels' policy to use the helper function.
-- This optimizes the query and avoids triggering nested RLS checks on channel_members.
DROP POLICY IF EXISTS "view_channels_policy" ON public.channels;

CREATE POLICY "view_channels_policy" ON public.channels
FOR SELECT
TO authenticated
USING (
  type = 'global'
  OR (
    type = 'group' AND EXISTS (
      SELECT 1 FROM public.study_group_members
      WHERE group_id = channels.related_id
      AND user_id = auth.uid()
    )
  )
  OR (
    type = 'dm' AND public.is_channel_member(id)
  )
);

-- 3. Update 'channel_members' policy to use the helper function.
-- This breaks the infinite recursion: "Am I allowed to see this member row? Yes, if I am a member of the same channel."
DROP POLICY IF EXISTS "view_channel_members_policy" ON public.channel_members;

CREATE POLICY "view_channel_members_policy" ON public.channel_members
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() -- I can always see myself
  OR public.is_channel_member(channel_id) -- I can see others if I am in the channel
);
