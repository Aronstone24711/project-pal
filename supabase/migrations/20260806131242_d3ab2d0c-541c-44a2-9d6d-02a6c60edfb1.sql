-- Remove anon discoverability/access on user-owned tables (all policies are authenticated-only)
REVOKE ALL ON TABLE public.profiles FROM anon;
REVOKE ALL ON TABLE public.saved_projects FROM anon;

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.saved_projects TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;
GRANT ALL ON TABLE public.saved_projects TO service_role;

-- Internal trigger functions must not be callable via the API
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role, supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO service_role;