# 🔧 FIX INSCRIPTION - Guide d'installation

## ❌ Problème

L'inscription des nouveaux utilisateurs échoue avec l'erreur :
```
POST /rest/v1/users 403 (Forbidden)
new row violates row-level security policy for table "users"
```

## ✅ Solution

Un trigger PostgreSQL qui insère automatiquement dans `public.users` lors de la création dans `auth.users`.

## 📝 Instructions

### Étape 1: Exécuter la migration SQL

1. **Ouvrir Supabase Dashboard**
   - Aller sur : https://supabase.com/dashboard/project/eukkzsbmsyxgklzzhiej
   - Cliquer sur "SQL Editor" dans le menu latéral

2. **Créer une nouvelle requête**
   - Cliquer sur "+ New query"

3. **Copier-coller le contenu**
   - Ouvrir le fichier : `supabase/migrations/030_fix_signup_rls.sql`
   - Copier tout le contenu
   - Coller dans l'éditeur SQL de Supabase

4. **Exécuter**
   - Cliquer sur "Run" (bouton en bas à droite)
   - Vérifier qu'il n'y a pas d'erreurs

### Étape 2: Déployer le code mis à jour

```powershell
# Commit des changements
git add .
git commit -m "fix: Add trigger for automatic user creation on signup"
git push origin main

# Déployer sur Vercel
vercel --prod
```

### Étape 3: Tester l'inscription

1. Aller sur : https://gestion-ecole-main.vercel.app/signup
2. Remplir le formulaire d'inscription
3. Vérifier que l'utilisateur est créé sans erreur 403

## 🔍 Vérification

### Vérifier que le trigger existe

```sql
-- Dans Supabase SQL Editor
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

### Vérifier la politique RLS

```sql
-- Dans Supabase SQL Editor
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'users' AND policyname LIKE '%insert%';
```

## 📚 Détails techniques

### Ce que fait le trigger

1. **Écoute** : Déclenché après chaque INSERT dans `auth.users`
2. **Crée** : Insère automatiquement dans `public.users` avec :
   - `id` : Même ID que dans auth.users
   - `email` : Email de l'utilisateur
   - `full_name` : Depuis metadata ou "Nouvel utilisateur"
   - `role` : SUPER_ADMIN (depuis metadata)
   - `is_active` : true
   - `must_change_password` : false

3. **Sécurisé** : Utilise `SECURITY DEFINER` pour bypasser RLS

### Nouvelle politique RLS

La politique `users_insert_admin_or_self` permet :
- ✅ SUPER_ADMIN peut créer n'importe quel utilisateur
- ✅ ADMIN peut créer des utilisateurs de son école
- ✅ L'utilisateur peut créer son propre enregistrement (signup)

## ⚠️ Important

- Le trigger s'exécute automatiquement, pas besoin de code supplémentaire
- L'utilisateur ne peut plus insérer manuellement dans `public.users` via le client
- Le code de signup a été simplifié pour ne plus faire l'insertion manuelle

## 🐛 Dépannage

### Le trigger ne se déclenche pas

```sql
-- Vérifier les logs
SELECT * FROM pg_stat_activity WHERE query LIKE '%handle_new_user%';
```

### L'utilisateur n'est pas créé dans public.users

```sql
-- Vérifier que le trigger existe et est activé
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### Erreur 403 persiste

1. Vérifier que la migration SQL a bien été exécutée
2. Vérifier que la politique RLS a été créée
3. Vider le cache de Supabase (attendre 1-2 minutes)
4. Réessayer l'inscription

## 📞 Support

Si le problème persiste :
1. Vérifier les logs Supabase : Dashboard > Logs > Postgres Logs
2. Vérifier les logs Vercel : Dashboard > Project > Logs
3. Ouvrir la console navigateur (F12) pour voir les erreurs détaillées
