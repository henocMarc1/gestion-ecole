-- ================================================
-- FIX: Permettre l'inscription de nouveaux utilisateurs
-- ================================================
-- Problème: Les politiques RLS bloquent l'insertion lors du signup
-- Solution: Trigger automatique + politique RLS permissive

-- ================================================
-- 1. Créer une fonction trigger pour auto-insertion
-- ================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insérer automatiquement dans public.users lors de la création dans auth.users
  INSERT INTO public.users (id, email, full_name, role, is_active, must_change_password)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Nouvel utilisateur'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'SUPER_ADMIN'),
    true,
    false
  )
  ON CONFLICT (id) DO NOTHING; -- Éviter les erreurs si l'utilisateur existe déjà
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- 2. Créer le trigger sur auth.users
-- ================================================

-- Supprimer le trigger s'il existe déjà
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Créer le nouveau trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ================================================
-- 3. Créer les fonctions helper si elles n'existent pas
-- ================================================

-- Fonction pour récupérer le rôle de l'utilisateur
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS TEXT AS $$
  SELECT role::TEXT FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Fonction pour récupérer le school_id de l'utilisateur
CREATE OR REPLACE FUNCTION auth.user_school_id()
RETURNS UUID AS $$
  SELECT school_id FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Fonction pour vérifier si SUPER_ADMIN
CREATE OR REPLACE FUNCTION auth.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(auth.user_role() = 'SUPER_ADMIN', false);
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Fonction pour vérifier si ADMIN ou SUPER_ADMIN
CREATE OR REPLACE FUNCTION auth.is_school_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(auth.user_role() IN ('SUPER_ADMIN', 'ADMIN'), false);
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ================================================
-- 4. Ajouter une politique RLS permissive pour l'insertion
-- ================================================

-- Supprimer l'ancienne politique d'insertion si elle existe
DROP POLICY IF EXISTS "users_insert_admin" ON public.users;
DROP POLICY IF EXISTS "users_insert_self_on_signup" ON public.users;
DROP POLICY IF EXISTS "users_insert_admin_or_self" ON public.users;

-- Nouvelle politique: Permettre l'insertion par les admins OU lors de l'inscription
CREATE POLICY "users_insert_admin_or_self"
  ON public.users FOR INSERT
  WITH CHECK (
    -- Admin peut créer n'importe quel utilisateur
    auth.is_super_admin()
    OR (school_id = auth.user_school_id() AND auth.is_school_admin())
    -- OU l'utilisateur peut créer son propre enregistrement (signup)
    OR (id = auth.uid())
  );

-- ================================================
-- 5. Commentaires et documentation
-- ================================================

COMMENT ON FUNCTION public.handle_new_user() IS 
  'Trigger function pour créer automatiquement un enregistrement dans public.users lorsqu''un nouvel utilisateur est créé dans auth.users. Utilisé pour le processus d''inscription.';

COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 
  'Insère automatiquement un nouvel utilisateur dans public.users après sa création dans auth.users';

COMMENT ON FUNCTION auth.user_role() IS 
  'Retourne le rôle de l''utilisateur connecté depuis public.users';

COMMENT ON FUNCTION auth.is_super_admin() IS 
  'Vérifie si l''utilisateur connecté a le rôle SUPER_ADMIN';

COMMENT ON FUNCTION auth.is_school_admin() IS 
  'Vérifie si l''utilisateur connecté a le rôle ADMIN ou SUPER_ADMIN';
