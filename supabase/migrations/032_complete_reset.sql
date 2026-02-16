-- ================================================
-- COMPLETE DATABASE RESET AND INITIALIZATION
-- ================================================
-- Este script réinitialise COMPLÈTEMENT la base de données
-- Utilisez-le UNIQUEMENT en développement!
-- ⚠️ ATTENTION: Cela supprimera TOUTES les données!

-- ================================================
-- 1. SUPPRIMER TOUS LES TRIGGERS ET FONCTIONS PROBLÉMATIQUES
-- ================================================

-- Supprimer les triggers de profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ================================================
-- 2. NETTOYER LES POLICIES RLS (si problématiques)
-- ================================================

-- Désactiver RLS temporairement pour initialiser
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools DISABLE ROW LEVEL SECURITY;

-- ================================================
-- 3. SUPPRIMER LES DONNÉES ORPHELINES
-- ================================================

-- Vider les tables (garder juste les écoles si nécessaire)
DELETE FROM public.users WHERE id NOT IN (
  SELECT id FROM auth.users
);

-- ================================================
-- 4. RÉACTIVER RLS
-- ================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- ================================================
-- 5. VÉRIFIER ET CORRIGER LES POLITIQUES RLS
-- ================================================

-- Vérifier les politiques actuelles
SELECT 
  schemaname, 
  tablename, 
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'users'
ORDER BY tablename, policyname;

-- ================================================
-- ✅ TERMINÉ
-- ================================================
-- La base est maintenant propre.
-- Ensuite, essayez l'inscription à nouveau.
-- L'API créera automatiquement le profil utilisateur.
