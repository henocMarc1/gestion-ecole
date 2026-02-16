# 🚨 ACTION URGENTE - Erreur d'inscription

## ❌ Problème actuel

Vous voyez cette erreur répétée :
```
User profile not found after retry
GET /rest/v1/users 406 (Not Acceptable)
```

**Cause** : Le trigger PostgreSQL n'a pas encore été installé dans Supabase !

## ✅ Solution en 3 étapes (5 minutes)

### Étape 1️⃣ : Installer le trigger (OBLIGATOIRE)

1. **Ouvrir Supabase SQL Editor** :
   - Cliquer ici 👉 https://supabase.com/dashboard/project/eukkzsbmsyxgklzzhiej/sql/new

2. **Copier-coller ce script** :
   - Ouvrir le fichier : `supabase/migrations/030_fix_signup_rls.sql`
   - Sélectionner TOUT (Ctrl+A)
   - Copier (Ctrl+C)
   - Coller dans l'éditeur SQL Supabase

3. **Exécuter** :
   - Cliquer sur le bouton **RUN** (en bas à droite)
   - ✅ Vérifier qu'il n'y a pas d'erreur rouge

### Étape 2️⃣ : Créer les profils manquants

1. **Dans le même éditeur SQL** :
   - Effacer le contenu précédent
   - Ouvrir le fichier : `supabase/fix_missing_profiles.sql`
   - Copier-coller le contenu

2. **Exécuter** :
   - Cliquer sur **RUN**
   - ✅ Vous devriez voir "Profils créés: 1" (ou plus)

### Étape 3️⃣ : Tester

1. **Rafraîchir la page web** (F5)
2. **Vous connecter avec vos identifiants**
3. ✅ Plus d'erreur "User profile not found" !

---

## 🔍 Vérification rapide

### Vérifier que le trigger existe

Copiez-collez dans Supabase SQL Editor :

```sql
SELECT 
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

**Résultat attendu** :
```
trigger_name          | event_object_table | action_statement
on_auth_user_created | users             | handle_new_user()
```

### Vérifier les profils créés

```sql
-- Compter les utilisateurs avec ET sans profil
SELECT 
  'Auth users' as type,
  COUNT(*) as nombre
FROM auth.users
UNION ALL
SELECT 
  'Public profiles' as type,
  COUNT(*) as nombre
FROM public.users;
```

**Les 2 nombres doivent être identiques !**

---

## 📋 Récapitulatif des fichiers

| Fichier | But | Quand l'exécuter |
|---------|-----|------------------|
| `030_fix_signup_rls.sql` | Créer le trigger automatique | 1️⃣ En premier |
| `fix_missing_profiles.sql` | Créer les profils manquants | 2️⃣ Ensuite |

---

## 🐛 Si ça ne fonctionne toujours pas

### Supprimer l'utilisateur test et recommencer

Dans Supabase SQL Editor :

```sql
-- Supprimer les utilisateurs de test
DELETE FROM auth.users WHERE email LIKE '%test%';
DELETE FROM public.users WHERE email LIKE '%test%';
```

Ensuite, réessayez de vous inscrire sur : https://gestion-ecole-main.vercel.app/signup

---

## 💡 Ce qui se passera après

✅ **Inscription fonctionnelle** : Chaque nouvel utilisateur créé dans `auth.users` aura automatiquement son profil créé dans `public.users`

✅ **Plus d'erreur 403** : Le trigger bypass les politiques RLS avec `SECURITY DEFINER`

✅ **Connexion immédiate** : L'utilisateur peut se connecter dès qu'il confirme son email

---

## ⏱️ Temps estimé

- **Installation du trigger** : 2 minutes
- **Création des profils manquants** : 1 minute
- **Test** : 1 minute
- **TOTAL** : 5 minutes maximum

🚀 **Allez-y maintenant !**
