-- 1. Create Study Group Members table
CREATE TABLE IF NOT EXISTS public.study_group_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.study_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id) -- Prevent duplicate joining
);

-- 2. Enable RLS
ALTER TABLE public.study_group_members ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Public view members" ON public.study_group_members FOR SELECT USING (true);
CREATE POLICY "Auth users can join" ON public.study_group_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave" ON public.study_group_members FOR DELETE USING (auth.uid() = user_id);

-- 4. Update Documents table for Category (if not exists)
-- (Assuming doc_category type was created in previous setup, if not, this ensures it works)
-- ALTER TYPE doc_category ADD VALUE IF NOT EXISTS 'lab'; 
-- ALTER TYPE doc_category ADD VALUE IF NOT EXISTS 'exam'; 
