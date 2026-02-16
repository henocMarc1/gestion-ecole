-- ================================================
-- FIX: Permettre l'inscription de nouveaux utilisateurs
-- ================================================
-- Problème: Les politiques RLS bloquent l'insertion lors du signup
-- Solution: Trigger automatique avec SECURITY DEFINER (bypass RLS)

-- ⚠️ NOTE IMPORTANTE:
-- Le trigger utilise SECURITY DEFINER qui s'exécute avec les permissions
-- du propriétaire de la fonction, ce qui bypass automatiquement les
-- politiques RLS. Pas besoin de modifier les politiques existantes !

-- ================================================
-- 1. Créer une fonction trigger pour auto-insertion
-- ================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER  -- Cette clause permet de bypass RLS automatiquement
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insérer automatiquement dans public.users lors de la création dans auth.users
  -- SECURITY DEFINER permet d'insérer même si RLS bloque normalement
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
EXCEPTION
  WHEN OTHERS THEN
    -- Logger l'erreur mais ne pas bloquer la création auth
    RAISE WARNING 'Erreur lors de la création du profil utilisateur: %', SQLERRM;
    RETURN NEW;
END;
$$;

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
-- ✅ TERMINÉ !
-- ================================================
-- Le trigger est maintenant actif.
-- 
-- Comment ça fonctionne:
-- 1. Quand un utilisateur s'inscrit, auth.users est créé
-- 2. Le trigger on_auth_user_created se déclenche automatiquement
-- 3. La fonction handle_new_user() insère dans public.users
-- 4. SECURITY DEFINER permet de bypass les politiques RLS
--
-- Prochaine étape: Exécuter fix_missing_profiles.sql
-- pour créer les profils des utilisateurs existants.
