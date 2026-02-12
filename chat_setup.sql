-- 1. Create Channels Table
CREATE TYPE channel_type AS ENUM ('global', 'group', 'dm');

CREATE TABLE public.channels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type channel_type NOT NULL,
  name TEXT, -- For Global/Group name
  slug TEXT UNIQUE, -- For Global channel (e.g., 'general')
  related_id UUID, -- Links to study_groups.id if type is 'group'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Messages Table
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Channel Members (For DMs mainly, Groups use study_group_members)
CREATE TABLE public.channel_members (
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (channel_id, user_id)
);

-- 4. Enable RLS
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_members ENABLE ROW LEVEL SECURITY;

-- 5. Policies

-- CHANNELS
-- Everyone can view Global channels
CREATE POLICY "Public view global channels" ON public.channels 
FOR SELECT USING (type = 'global');

-- Members can view Group channels (via study_group_members)
CREATE POLICY "Members view group channels" ON public.channels 
FOR SELECT USING (
  type = 'group' AND EXISTS (
    SELECT 1 FROM public.study_group_members 
    WHERE group_id = channels.related_id AND user_id = auth.uid()
  )
);

-- Members can view DM channels
CREATE POLICY "Members view dm channels" ON public.channels 
FOR SELECT USING (
  type = 'dm' AND EXISTS (
    SELECT 1 FROM public.channel_members 
    WHERE channel_id = channels.id AND user_id = auth.uid()
  )
);

-- MESSAGES
-- View messages if you can view the channel
CREATE POLICY "View messages" ON public.messages 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.channels WHERE id = messages.channel_id AND (
      type = 'global'
      OR (type = 'group' AND EXISTS (SELECT 1 FROM public.study_group_members WHERE group_id = channels.related_id AND user_id = auth.uid()))
      OR (type = 'dm' AND EXISTS (SELECT 1 FROM public.channel_members WHERE channel_id = channels.id AND user_id = auth.uid()))
    )
  )
);

-- Send messages
CREATE POLICY "Send messages" ON public.messages 
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM public.channels WHERE id = channel_id AND (
      type = 'global'
      OR (type = 'group' AND EXISTS (SELECT 1 FROM public.study_group_members WHERE group_id = channels.related_id AND user_id = auth.uid()))
      OR (type = 'dm' AND EXISTS (SELECT 1 FROM public.channel_members WHERE channel_id = channels.id AND user_id = auth.uid()))
    )
  )
);

-- 6. Seed Data: Create Global Channel
INSERT INTO public.channels (type, name, slug) 
VALUES ('global', 'Sảnh chung', 'general')
ON CONFLICT (slug) DO NOTHING;

-- 7. Trigger: Auto create channel for new groups
CREATE OR REPLACE FUNCTION public.handle_new_group_channel()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.channels (type, name, related_id)
  VALUES ('group', NEW.name, NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_group_created
  AFTER INSERT ON public.study_groups
  for each row execute procedure public.handle_new_group_channel();
