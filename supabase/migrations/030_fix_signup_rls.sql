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
-- 3. Ajouter une politique RLS permissive pour l'insertion
-- ================================================

-- Supprimer l'ancienne politique d'insertion si elle existe
DROP POLICY IF EXISTS "users_insert_admin" ON public.users;
DROP POLICY IF EXISTS "users_insert_self_on_signup" ON public.users;
DROP POLICY IF EXISTS "users_insert_admin_or_self" ON public.users;

-- Nouvelle politique SIMPLIFIÉE: Permettre l'insertion si c'est l'utilisateur lui-même
-- Le trigger SECURITY DEFINER s'occupe de l'insertion automatique
CREATE POLICY "users_insert_admin_or_self"
  ON public.users FOR INSERT
  WITH CHECK (
    -- Permettre si l'ID correspond à l'utilisateur authentifié
    id = auth.uid()
    -- OU si l'utilisateur a déjà un rôle SUPER_ADMIN/ADMIN (fonctions existantes)
    OR EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('SUPER_ADMIN', 'ADMIN')
    )
  );

-- ================================================
-- 4. Commentaires et documentation
-- ================================================

COMMENT ON FUNCTION public.handle_new_user() IS 
  'Trigger function pour créer automatiquement un enregistrement dans public.users lorsqu''un nouvel utilisateur est créé dans auth.users. Utilisé pour le processus d''inscription. Utilise SECURITY DEFINER pour bypass RLS.';

COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 
  'Insère automatiquement un nouvel utilisateur dans public.users après sa création dans auth.users. Le trigger utilise SECURITY DEFINER pour éviter les problèmes de RLS lors de l''inscription.';
