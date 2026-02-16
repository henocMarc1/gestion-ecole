-- ================================================
-- SCRIPT DE RATTRAPAGE : Créer les profils manquants
-- ================================================
-- Exécute ceci APRÈS avoir créé le trigger pour corriger
-- les utilisateurs qui se sont inscrits avant le trigger

-- Créer les profils manquants pour tous les utilisateurs auth existants
INSERT INTO public.users (id, email, full_name, role, is_active, must_change_password)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email, 'Nouvel utilisateur'),
  COALESCE((au.raw_user_meta_data->>'role')::user_role, 'SUPER_ADMIN'),
  true,
  false
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL; -- Seulement les utilisateurs sans profil

-- Afficher le résultat
SELECT 
  'Profils créés' as status,
  COUNT(*) as nombre
FROM auth.users au
INNER JOIN public.users pu ON au.id = pu.id;
