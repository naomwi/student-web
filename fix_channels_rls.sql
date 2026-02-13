-- Fix RLS policies for Channels and Chat features

-- 1. Update the Trigger Function for Group Channels to be SECURITY DEFINER
-- This ensures that when a user creates a group, the system can create the corresponding channel
-- without the user needing explicit INSERT permissions on the 'channels' table for group types.
CREATE OR REPLACE FUNCTION public.handle_new_group_channel()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.channels (type, name, related_id)
  VALUES ('group', NEW.name, NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop existing restrictive policies on 'channels' to avoid conflicts
-- We drop policies by name to ensure we are starting fresh with the correct logic.
DROP POLICY IF EXISTS "Public view global channels" ON public.channels;
DROP POLICY IF EXISTS "Members view group channels" ON public.channels;
DROP POLICY IF EXISTS "Members view dm channels" ON public.channels;
DROP POLICY IF EXISTS "Users can create dm channels" ON public.channels;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.channels;
DROP POLICY IF EXISTS "view_channels_policy" ON public.channels;
DROP POLICY IF EXISTS "insert_dm_channels_policy" ON public.channels;

-- 3. Create comprehensive Policies for 'channels'

-- SELECT: Authenticated users can see:
-- a) Global channels
-- b) Group channels they belong to (via study_group_members)
-- c) DM channels they belong to (via channel_members)
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
    type = 'dm' AND EXISTS (
      SELECT 1 FROM public.channel_members
      WHERE channel_id = channels.id
      AND user_id = auth.uid()
    )
  )
);

-- INSERT: Authenticated users can create DM channels directly.
-- Group channels are created via the trigger (SECURITY DEFINER), so no policy needed for 'group' type here for users.
CREATE POLICY "insert_dm_channels_policy" ON public.channels
FOR INSERT
TO authenticated
WITH CHECK (
  type = 'dm'
);

-- 4. Fix Policies for 'channel_members' (for DMs)
-- We need to allow users to add members (themselves and the other person) when creating a DM.

DROP POLICY IF EXISTS "Users can add members to dm channels" ON public.channel_members;
DROP POLICY IF EXISTS "view_channel_members" ON public.channel_members;
DROP POLICY IF EXISTS "insert_channel_members_policy" ON public.channel_members;
DROP POLICY IF EXISTS "view_channel_members_policy" ON public.channel_members;

-- INSERT: Allow adding members if the channel is a DM.
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

-- SELECT: Users can see memberships for channels they are part of.
CREATE POLICY "view_channel_members_policy" ON public.channel_members
FOR SELECT
TO authenticated
USING (
  -- Show membership if I am the user OR if I am in the same channel
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.channel_members cm
    WHERE cm.channel_id = channel_members.channel_id
    AND cm.user_id = auth.uid()
  )
);

-- 5. Fix Policies for 'messages'
-- Ensure users can only send/view messages in channels they have access to.

DROP POLICY IF EXISTS "View messages" ON public.messages;
DROP POLICY IF EXISTS "Send messages" ON public.messages;
DROP POLICY IF EXISTS "view_messages_policy" ON public.messages;
DROP POLICY IF EXISTS "insert_messages_policy" ON public.messages;

CREATE POLICY "view_messages_policy" ON public.messages
FOR SELECT
TO authenticated
USING (
   EXISTS (
    SELECT 1 FROM public.channels
    WHERE id = messages.channel_id
    AND (
      type = 'global'
      OR (type = 'group' AND EXISTS (SELECT 1 FROM public.study_group_members WHERE group_id = channels.related_id AND user_id = auth.uid()))
      OR (type = 'dm' AND EXISTS (SELECT 1 FROM public.channel_members WHERE channel_id = channels.id AND user_id = auth.uid()))
    )
  )
);

CREATE POLICY "insert_messages_policy" ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
   user_id = auth.uid() AND
   EXISTS (
    SELECT 1 FROM public.channels
    WHERE id = messages.channel_id
    AND (
      type = 'global'
      OR (type = 'group' AND EXISTS (SELECT 1 FROM public.study_group_members WHERE group_id = channels.related_id AND user_id = auth.uid()))
      OR (type = 'dm' AND EXISTS (SELECT 1 FROM public.channel_members WHERE channel_id = channels.id AND user_id = auth.uid()))
    )
  )
);
