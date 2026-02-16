-- ================================================
-- QUICK INITIALIZATION SCRIPT
-- ================================================
-- Exécutez ce script juste après avoir créé un projet Supabase
-- Cela va:
-- 1. Créer une école par défaut
-- 2. Nettoyer les triggers conflictuels
-- 3. Préparer la base pour l'inscription

-- ================================================
-- 1. Créer une école par défaut
-- ================================================
INSERT INTO public.schools (name, code, created_at, updated_at)
VALUES (
  'École Primaire par Défaut', 
  'ECOLE_DEFAULT_001', 
  NOW(), 
  NOW()
)
ON CONFLICT (code) DO NOTHING;

-- ================================================
-- 2. Supprimer les triggers conflictuels
-- ================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ================================================
-- 3. Vérifier les données créées
-- ================================================
SELECT 'Schools created:' as check_point;
SELECT id, name, code FROM public.schools;

SELECT '' as separator;
SELECT 'Users in database:' as check_point;
SELECT COUNT(*) as user_count FROM public.users;

-- ================================================
-- ✅ TERMINÉ!
-- ================================================
-- Vous pouvez maintenant:
-- 1. Redémarrer le serveur (npm run dev)
-- 2. Aller à http://localhost:3000/signup
-- 3. Créer un nouveau compte

-- Le profil sera créé automatiquement par l'API.
