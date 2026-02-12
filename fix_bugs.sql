-- 1. Fix Profiles (Add Mentor Fields)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_mentor BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';

-- 2. Fix Study Groups RLS (Allow access)
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view groups
CREATE POLICY "Public view study_groups" ON public.study_groups FOR SELECT USING (true);

-- Allow authenticated users to create groups
CREATE POLICY "Auth users create study_groups" ON public.study_groups FOR INSERT WITH CHECK (auth.uid() = leader_id);

-- Allow leader to update their group
CREATE POLICY "Leader update study_groups" ON public.study_groups FOR UPDATE USING (auth.uid() = leader_id);

-- Allow leader to delete their group
CREATE POLICY "Leader delete study_groups" ON public.study_groups FOR DELETE USING (auth.uid() = leader_id);
