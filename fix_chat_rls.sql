-- 1. Allow authenticated users to create DM channels
CREATE POLICY "Users can create dm channels" 
ON public.channels 
FOR INSERT 
TO authenticated 
WITH CHECK (type = 'dm');

-- 2. Allow authenticated users to add members to DM channels
-- This allows inserting any user into a channel IF that channel is of type 'dm'
CREATE POLICY "Users can add members to dm channels" 
ON public.channel_members 
FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.channels 
    WHERE id = channel_members.channel_id 
    AND type = 'dm'
  )
);
