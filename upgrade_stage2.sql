-- 1. Mentorship System
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_mentor BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS linkedin_url TEXT;

-- Bảng yêu cầu Mentor
CREATE TABLE IF NOT EXISTS public.mentorship_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mentee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own requests" ON public.mentorship_requests 
FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

CREATE POLICY "Create request" ON public.mentorship_requests 
FOR INSERT WITH CHECK (auth.uid() = mentee_id);

CREATE POLICY "Update request" ON public.mentorship_requests 
FOR UPDATE USING (auth.uid() = mentor_id);

-- 2. Chat System (Simple)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- Null nếu là group chat
  group_id UUID REFERENCES public.study_groups(id) ON DELETE CASCADE, -- Null nếu là private chat
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View messages" ON public.messages 
FOR SELECT USING (
  auth.uid() = sender_id 
  OR auth.uid() = receiver_id 
  OR EXISTS (SELECT 1 FROM study_group_members WHERE group_id = messages.group_id AND user_id = auth.uid())
);

CREATE POLICY "Send messages" ON public.messages 
FOR INSERT WITH CHECK (auth.uid() = sender_id);
