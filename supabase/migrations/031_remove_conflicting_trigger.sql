-- ================================================
-- FIX: Supprimer le trigger conflictuel
-- ================================================
-- Problème: Le trigger on_auth_user_created crée automatiquement
-- un profil SANS school_id, ce qui crée un conflit avec l'API
-- qui essaie d'insérer un profil avec school_id.
--
-- Solution: Supprimer le trigger et laisser l'API gérer la création

-- Supprimer le trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Supprimer la fonction
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ================================================
-- ✅ Trigger supprimé!
-- ================================================
-- L'API route.ts gérera maintenant la création du profil
-- avec les bonnes données (email, full_name, school_id, role, etc.)
