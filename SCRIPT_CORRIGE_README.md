# 🔧 SCRIPT SQL CORRIGÉ - Prêt à exécuter

## ✅ Le problème a été résolu

Le script a été mis à jour pour inclure toutes les fonctions nécessaires.

## 📝 Instructions (2 minutes)

### 1. Ouvrir Supabase SQL Editor
👉 https://supabase.com/dashboard/project/eukkzsbmsyxgklzzhiej/sql/new

### 2. Copier-coller le script complet

Ouvrez le fichier : **`supabase/migrations/030_fix_signup_rls.sql`**

Sélectionnez TOUT le contenu (Ctrl+A), copiez (Ctrl+C), et collez dans l'éditeur Supabase.

### 3. Exécuter

Cliquez sur le bouton **RUN** en bas à droite.

✅ **Résultat attendu** : "Success. No rows returned"

### 4. Créer les profils manquants

Ouvrez le fichier : **`supabase/fix_missing_profiles.sql`**

Copiez-collez le contenu dans l'éditeur et cliquez sur **RUN**.

✅ **Résultat attendu** : "Profils créés: 1" (ou le nombre d'utilisateurs créés)

### 5. Tester

Rafraîchissez votre page (F5) et reconnectez-vous.

---

## 🎯 Ce que fait le script

1. ✅ **Crée la fonction `handle_new_user()`** : Insère automatiquement dans `public.users`
2. ✅ **Crée le trigger `on_auth_user_created`** : S'exécute après chaque inscription
3. ✅ **Crée les fonctions helper** : `auth.is_super_admin()`, `auth.user_role()`, etc.
4. ✅ **Met à jour la politique RLS** : Permet l'auto-inscription

---

## 🔍 Vérification

Après avoir exécuté le script, vérifiez que tout fonctionne :

```sql
-- Vérifier que le trigger existe
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

**Résultat attendu** :
```
trigger_name          | event_object_table
on_auth_user_created | users
```

---

## 🚀 Ensuite

Une fois les 2 scripts exécutés :

1. Rafraîchir la page (F5)
2. Se connecter avec vos identifiants
3. ✅ Plus d'erreur "User profile not found" !

---

**Temps total : 2-3 minutes maximum**
