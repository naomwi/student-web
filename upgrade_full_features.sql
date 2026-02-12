-- 1. GAMIFICATION (Hệ thống điểm)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS reputation INT DEFAULT 0;

-- Trigger: Cộng 10 điểm khi đăng bài Blog
CREATE OR REPLACE FUNCTION add_reputation_post() RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles SET reputation = reputation + 10 WHERE id = NEW.author_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_post_created AFTER INSERT ON public.posts
FOR EACH ROW EXECUTE FUNCTION add_reputation_post();

-- Trigger: Cộng 5 điểm khi upload tài liệu
CREATE OR REPLACE FUNCTION add_reputation_doc() RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles SET reputation = reputation + 5 WHERE id = NEW.uploader_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_doc_created AFTER INSERT ON public.documents
FOR EACH ROW EXECUTE FUNCTION add_reputation_doc();


-- 2. EDIT LOGS (Lịch sử chỉnh sửa)
CREATE TABLE IF NOT EXISTS public.edit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  target_id UUID NOT NULL, -- ID bài viết hoặc comment
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment')),
  old_content TEXT,
  new_content TEXT,
  edited_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.edit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view logs" ON public.edit_logs FOR SELECT USING (true);


-- 3. Q&A SYSTEM (Hỏi đáp)
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  views INT DEFAULT 0,
  is_solved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_accepted BOOLEAN DEFAULT FALSE,
  votes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

-- Policies đơn giản
CREATE POLICY "Public view questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Users create questions" ON public.questions FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Public view answers" ON public.answers FOR SELECT USING (true);
CREATE POLICY "Users create answers" ON public.answers FOR INSERT WITH CHECK (auth.uid() = author_id);
-- Cho phép tác giả câu hỏi chọn câu trả lời đúng
CREATE POLICY "Author accept answer" ON public.answers FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.questions WHERE id = question_id AND author_id = auth.uid())
);
