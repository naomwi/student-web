-- 1. Update Profiles (Add Major, Year, Bio)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS major TEXT,
ADD COLUMN IF NOT EXISTS year INT,
ADD COLUMN IF NOT EXISTS bio TEXT;

-- 2. Update Posts (Add Tags)
ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 3. Update Study Groups (Add Location, Max Members)
ALTER TABLE public.study_groups
ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Online',
ADD COLUMN IF NOT EXISTS max_members INT DEFAULT 10;

-- 4. Create Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable RLS for Comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for Comments
-- Everyone can read comments
CREATE POLICY "Public comments are viewable by everyone" 
ON public.comments FOR SELECT USING (true);

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments" 
ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments" 
ON public.comments FOR DELETE USING (auth.uid() = user_id);
