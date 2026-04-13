-- ============================================================
-- AWS AIF-C01 Study Site - Community Tables for Supabase
-- ============================================================
-- 실행 방법: Supabase Dashboard > SQL Editor 에서 실행
-- 주의: 기존 커뮤니티 테이블을 모두 삭제 후 재생성합니다
--       (profiles 테이블은 유지, auth.users 데이터 보존)
-- ============================================================


-- ============================================================
-- 0. 기존 테이블 정리 (의존성 역순으로 삭제)
-- ============================================================
DROP VIEW IF EXISTS public.comments_with_author CASCADE;
DROP VIEW IF EXISTS public.tips_with_author CASCADE;
DROP VIEW IF EXISTS public.success_stories_with_author CASCADE;
DROP VIEW IF EXISTS public.notices_with_author CASCADE;
DROP VIEW IF EXISTS public.posts_with_author CASCADE;

DROP TABLE IF EXISTS public.reports CASCADE;
DROP TABLE IF EXISTS public.likes CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.tips CASCADE;
DROP TABLE IF EXISTS public.success_stories CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.notices CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

DROP FUNCTION IF EXISTS public.update_like_count() CASCADE;
DROP FUNCTION IF EXISTS public.update_comment_count() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 고아 인덱스 정리 (이전 부분 실행으로 테이블 없이 남은 인덱스)
DROP INDEX IF EXISTS public.idx_notices_created_at;
DROP INDEX IF EXISTS public.idx_notices_pinned;
DROP INDEX IF EXISTS public.idx_posts_created_at;
DROP INDEX IF EXISTS public.idx_posts_category;
DROP INDEX IF EXISTS public.idx_posts_author;
DROP INDEX IF EXISTS public.idx_success_stories_created_at;
DROP INDEX IF EXISTS public.idx_success_stories_exam;
DROP INDEX IF EXISTS public.idx_tips_created_at;
DROP INDEX IF EXISTS public.idx_tips_tag;
DROP INDEX IF EXISTS public.idx_comments_target;
DROP INDEX IF EXISTS public.idx_comments_parent;
DROP INDEX IF EXISTS public.idx_comments_author;
DROP INDEX IF EXISTS public.idx_likes_target;
DROP INDEX IF EXISTS public.idx_likes_user;
DROP INDEX IF EXISTS public.idx_reports_status;

-- 트리거 정리
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;


-- ============================================================
-- 1. 사용자 프로필 (profiles)
-- auth.users 와 1:1 연결, 커뮤니티에서 사용할 닉네임/아바타
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  bio TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- auth.users 가입 시 자동으로 profiles 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '익명'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 기존 auth.users 중 profiles가 없는 유저 보정
INSERT INTO public.profiles (id, display_name, avatar_url)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', '익명'),
  COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture', NULL)
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id);


-- ============================================================
-- 2. 공지사항 (notices)
-- 관리자만 작성, 모든 유저 읽기 가능
-- ============================================================
CREATE TABLE public.notices (
  id BIGSERIAL PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notices_created_at ON public.notices (created_at DESC);
CREATE INDEX idx_notices_pinned ON public.notices (is_pinned DESC, created_at DESC);


-- ============================================================
-- 3. 게시판 (posts)
-- 자유게시판 - 로그인 유저 작성 가능
-- ============================================================
CREATE TABLE public.posts (
  id BIGSERIAL PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'question', 'discussion', 'study-group')),
  view_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_posts_created_at ON public.posts (created_at DESC);
CREATE INDEX idx_posts_category ON public.posts (category, created_at DESC);
CREATE INDEX idx_posts_author ON public.posts (author_id);


-- ============================================================
-- 4. 시험합격수기 (success_stories)
-- 합격 경험 공유 게시판
-- ============================================================
CREATE TABLE public.success_stories (
  id BIGSERIAL PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  exam_code TEXT NOT NULL DEFAULT 'AIF-C01',
  exam_date DATE,
  score INTEGER CHECK (score >= 0 AND score <= 1000),
  study_duration TEXT,
  study_resources TEXT,
  difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  view_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_success_stories_created_at ON public.success_stories (created_at DESC);
CREATE INDEX idx_success_stories_exam ON public.success_stories (exam_code, created_at DESC);


-- ============================================================
-- 5. 시험팁공유 (tips)
-- 학습 팁, 시험 전략 공유
-- ============================================================
CREATE TABLE public.tips (
  id BIGSERIAL PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tag TEXT NOT NULL DEFAULT 'general' CHECK (tag IN ('general', 'study-method', 'exam-strategy', 'resource', 'time-management')),
  exam_code TEXT NOT NULL DEFAULT 'AIF-C01',
  view_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tips_created_at ON public.tips (created_at DESC);
CREATE INDEX idx_tips_tag ON public.tips (tag, created_at DESC);


-- ============================================================
-- 6. 댓글 (comments)
-- 모든 게시판 공용 댓글 (polymorphic), 대댓글 지원
-- ============================================================
CREATE TABLE public.comments (
  id BIGSERIAL PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'notice', 'success_story', 'tip')),
  target_id BIGINT NOT NULL,
  parent_id BIGINT REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_target ON public.comments (target_type, target_id, created_at);
CREATE INDEX idx_comments_parent ON public.comments (parent_id);
CREATE INDEX idx_comments_author ON public.comments (author_id);


-- ============================================================
-- 7. 좋아요 (likes)
-- 글 + 댓글 좋아요 (유저당 1회)
-- ============================================================
CREATE TABLE public.likes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'notice', 'success_story', 'tip', 'comment')),
  target_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, target_type, target_id)
);

CREATE INDEX idx_likes_target ON public.likes (target_type, target_id);
CREATE INDEX idx_likes_user ON public.likes (user_id);


-- ============================================================
-- 8. 신고 (reports)
-- 부적절 콘텐츠 신고
-- ============================================================
CREATE TABLE public.reports (
  id BIGSERIAL PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'notice', 'success_story', 'tip', 'comment')),
  target_id BIGINT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'abuse', 'inappropriate', 'copyright', 'other')),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES public.profiles(id)
);

CREATE INDEX idx_reports_status ON public.reports (status, created_at DESC);


-- ============================================================
-- 9. updated_at 자동 갱신 트리거
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.notices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.success_stories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.tips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- ============================================================
-- 10. comment_count / like_count 자동 카운트 트리거
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.target_type = 'post' THEN
      UPDATE public.posts SET comment_count = comment_count + 1 WHERE id = NEW.target_id;
    ELSIF NEW.target_type = 'success_story' THEN
      UPDATE public.success_stories SET comment_count = comment_count + 1 WHERE id = NEW.target_id;
    ELSIF NEW.target_type = 'tip' THEN
      UPDATE public.tips SET comment_count = comment_count + 1 WHERE id = NEW.target_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.target_type = 'post' THEN
      UPDATE public.posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.target_id;
    ELSIF OLD.target_type = 'success_story' THEN
      UPDATE public.success_stories SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.target_id;
    ELSIF OLD.target_type = 'tip' THEN
      UPDATE public.tips SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.target_id;
    END IF;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_change
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_comment_count();

CREATE OR REPLACE FUNCTION public.update_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.target_type = 'post' THEN
      UPDATE public.posts SET like_count = like_count + 1 WHERE id = NEW.target_id;
    ELSIF NEW.target_type = 'success_story' THEN
      UPDATE public.success_stories SET like_count = like_count + 1 WHERE id = NEW.target_id;
    ELSIF NEW.target_type = 'tip' THEN
      UPDATE public.tips SET like_count = like_count + 1 WHERE id = NEW.target_id;
    ELSIF NEW.target_type = 'comment' THEN
      UPDATE public.comments SET like_count = like_count + 1 WHERE id = NEW.target_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.target_type = 'post' THEN
      UPDATE public.posts SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.target_id;
    ELSIF OLD.target_type = 'success_story' THEN
      UPDATE public.success_stories SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.target_id;
    ELSIF OLD.target_type = 'tip' THEN
      UPDATE public.tips SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.target_id;
    ELSIF OLD.target_type = 'comment' THEN
      UPDATE public.comments SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.target_id;
    END IF;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_like_change
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.update_like_count();


-- ============================================================
-- 11. Row Level Security (RLS) 정책
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- notices (관리자만 작성)
CREATE POLICY "notices_select" ON public.notices FOR SELECT USING (true);
CREATE POLICY "notices_insert_admin" ON public.notices FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')));
CREATE POLICY "notices_update_admin" ON public.notices FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')));
CREATE POLICY "notices_delete_admin" ON public.notices FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')));

-- posts
CREATE POLICY "posts_select" ON public.posts FOR SELECT USING (true);
CREATE POLICY "posts_insert" ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "posts_update_own" ON public.posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "posts_delete_own" ON public.posts FOR DELETE
  USING (auth.uid() = author_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')));

-- success_stories
CREATE POLICY "stories_select" ON public.success_stories FOR SELECT USING (true);
CREATE POLICY "stories_insert" ON public.success_stories FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "stories_update_own" ON public.success_stories FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "stories_delete_own" ON public.success_stories FOR DELETE
  USING (auth.uid() = author_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')));

-- tips
CREATE POLICY "tips_select" ON public.tips FOR SELECT USING (true);
CREATE POLICY "tips_insert" ON public.tips FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "tips_update_own" ON public.tips FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "tips_delete_own" ON public.tips FOR DELETE
  USING (auth.uid() = author_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')));

-- comments
CREATE POLICY "comments_select" ON public.comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON public.comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "comments_update_own" ON public.comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "comments_delete_own" ON public.comments FOR DELETE
  USING (auth.uid() = author_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')));

-- likes
CREATE POLICY "likes_select" ON public.likes FOR SELECT USING (true);
CREATE POLICY "likes_insert" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes_delete_own" ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- reports
CREATE POLICY "reports_insert" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "reports_select_admin" ON public.reports FOR SELECT
  USING (auth.uid() = reporter_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')));
CREATE POLICY "reports_update_admin" ON public.reports FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')));


-- ============================================================
-- 12. 뷰(Views) - 프론트엔드 조회용
-- ============================================================

CREATE OR REPLACE VIEW public.posts_with_author AS
SELECT p.*, pr.display_name AS author_name, pr.avatar_url AS author_avatar
FROM public.posts p JOIN public.profiles pr ON p.author_id = pr.id;

CREATE OR REPLACE VIEW public.notices_with_author AS
SELECT n.*, pr.display_name AS author_name, pr.avatar_url AS author_avatar
FROM public.notices n JOIN public.profiles pr ON n.author_id = pr.id;

CREATE OR REPLACE VIEW public.success_stories_with_author AS
SELECT s.*, pr.display_name AS author_name, pr.avatar_url AS author_avatar
FROM public.success_stories s JOIN public.profiles pr ON s.author_id = pr.id;

CREATE OR REPLACE VIEW public.tips_with_author AS
SELECT t.*, pr.display_name AS author_name, pr.avatar_url AS author_avatar
FROM public.tips t JOIN public.profiles pr ON t.author_id = pr.id;

CREATE OR REPLACE VIEW public.comments_with_author AS
SELECT c.*, pr.display_name AS author_name, pr.avatar_url AS author_avatar
FROM public.comments c JOIN public.profiles pr ON c.author_id = pr.id;


-- ============================================================
-- 완료!
-- ============================================================
