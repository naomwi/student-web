-- Comprehensive Fix for Chat RLS, Recursion, and Auth Issues

-- 1. Helper Function to Break Recursion in RLS
-- SECURITY DEFINER bypasses RLS on channel_members when called
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

-- 2. Auth Function for Username Login
-- Allows secure lookup of email by username (bypassing restrictive profiles RLS)
CREATE OR REPLACE FUNCTION public.get_email_by_username(username_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
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

-- 3. Trigger Function for Group Channels
-- SECURITY DEFINER allows inserting channel without user needing explicit permissions
CREATE OR REPLACE FUNCTION public.handle_new_group_channel()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.channels (type, name, related_id)
  VALUES ('group', NEW.name, NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Clean up Old Policies (to ensure no conflicts)
DROP POLICY IF EXISTS "Public view global channels" ON public.channels;
DROP POLICY IF EXISTS "Members view group channels" ON public.channels;
DROP POLICY IF EXISTS "Members view dm channels" ON public.channels;
DROP POLICY IF EXISTS "Users can create dm channels" ON public.channels;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.channels;
DROP POLICY IF EXISTS "view_channels_policy" ON public.channels;
DROP POLICY IF EXISTS "insert_dm_channels_policy" ON public.channels;

DROP POLICY IF EXISTS "Users can add members to dm channels" ON public.channel_members;
DROP POLICY IF EXISTS "view_channel_members" ON public.channel_members;
DROP POLICY IF EXISTS "insert_channel_members_policy" ON public.channel_members;
DROP POLICY IF EXISTS "view_channel_members_policy" ON public.channel_members;

DROP POLICY IF EXISTS "View messages" ON public.messages;
DROP POLICY IF EXISTS "Send messages" ON public.messages;
DROP POLICY IF EXISTS "view_messages_policy" ON public.messages;
DROP POLICY IF EXISTS "insert_messages_policy" ON public.messages;


-- 5. CHANNELS Policies
-- INSERT: Allow creating DM channels only (Groups are handled by trigger)
CREATE POLICY "insert_dm_channels_policy" ON public.channels
FOR INSERT
TO authenticated
WITH CHECK (type = 'dm');

-- SELECT: Use non-recursive logic
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

-- 6. CHANNEL_MEMBERS Policies
-- INSERT: Allow adding members to DM channels (must check if channel is DM)
CREATE POLICY "insert_channel_members_policy" ON public.channel_members
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.channels
    WHERE id = channel_members.channel_id
    AND type = 'dm'
  )
);

-- SELECT: Use helper function to avoid recursion
CREATE POLICY "view_channel_members_policy" ON public.channel_members
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_channel_member(channel_id)
);

-- 7. MESSAGES Policies
-- INSERT: Must be a member of the channel
CREATE POLICY "insert_messages_policy" ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
   user_id = auth.uid() AND (
     -- For Global
     EXISTS (SELECT 1 FROM public.channels WHERE id = messages.channel_id AND type = 'global')
     OR
     -- For Group (via study_group_members)
     EXISTS (
       SELECT 1 FROM public.channels c
       JOIN public.study_group_members sgm ON c.related_id = sgm.group_id
       WHERE c.id = messages.channel_id AND sgm.user_id = auth.uid() AND c.type = 'group'
     )
     OR
     -- For DM (via is_channel_member helper)
     public.is_channel_member(messages.channel_id)
   )
);

-- SELECT: Must be a member of the channel
CREATE POLICY "view_messages_policy" ON public.messages
FOR SELECT
TO authenticated
USING (
     -- For Global
     EXISTS (SELECT 1 FROM public.channels WHERE id = messages.channel_id AND type = 'global')
     OR
     -- For Group
     EXISTS (
       SELECT 1 FROM public.channels c
       JOIN public.study_group_members sgm ON c.related_id = sgm.group_id
       WHERE c.id = messages.channel_id AND sgm.user_id = auth.uid() AND c.type = 'group'
     )
     OR
     -- For DM
     public.is_channel_member(messages.channel_id)
);
