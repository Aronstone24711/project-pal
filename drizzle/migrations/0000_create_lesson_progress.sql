CREATE TABLE public.lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lesson_id text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_progress TO authenticated;
GRANT ALL ON public.lesson_progress TO service_role;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own lesson progress" ON public.lesson_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users add own lesson progress" ON public.lesson_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own lesson progress" ON public.lesson_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own lesson progress" ON public.lesson_progress FOR DELETE TO authenticated USING (auth.uid() = user_id);