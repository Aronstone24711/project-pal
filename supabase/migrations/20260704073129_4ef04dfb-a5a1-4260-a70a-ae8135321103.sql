
DROP POLICY IF EXISTS "Users can create their own projects" ON public.saved_projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.saved_projects;
DROP POLICY IF EXISTS "Users can view their own projects" ON public.saved_projects;

CREATE POLICY "Users can create their own projects" ON public.saved_projects
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON public.saved_projects
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own projects" ON public.saved_projects
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can create their own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
