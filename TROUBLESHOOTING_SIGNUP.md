# 🔧 Dépannage Complet - Erreur "duplicate key value"

## Problème
```
Error: duplicate key value violates unique constraint "users_pkey"
```

## Cause Identifiée
Un trigger automatique (`on_auth_user_created`) créait les profils utilisateurs SANS `school_id`, ce qui créait un conflit quand l'API essayait d'insérer le profil avec `school_id`.

## ✅ Solutions Appliquées

### 1. Migration SQL - Supprimer le Trigger Conflictuel
Une migration a été créée: `supabase/migrations/031_remove_conflicting_trigger.sql`

**Étapes pour exécuter la migration:**

1. Ouvrez **Supabase Dashboard**
2. Allez à **SQL Editor**
3. Cliquez sur **"New Query"**
4. Copiez le contenu du fichier `supabase/migrations/031_remove_conflicting_trigger.sql`
5. Collez dans l'éditeur SQL
6. Cliquez sur **"Run"** (ou Ctrl+Enter)
7. Attendez le message **✅ "Query executed successfully"**

**Content de la migration:**
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
```

### 2. Modification de l'API
L'API `src/app/api/auth/signup/route.ts` a été mise à jour:
- **Avant:** `insert()` → créait une erreur si le profil existait déjà
- **Après:** `upsert()` → crée OU met à jour le profil

Cela rend l'API bien plus robuste!

## 🚀 Prochaines Étapes

### Étape 1: Exécuter la Migration SQL
⚠️ **IMPORTANT:** Vous DEVEZ exécuter cette migration d'abord!

1. Allez à [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Allez à **SQL Editor**
4. Copiez/collez et exécutez:
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
```

### Étape 2: Redémarrer le Serveur
```powershell
# Arrêtez le serveur (Ctrl+C dans le terminal)
# Puis redémarrez
npm run dev
```

### Étape 3: Nettoyer les Données (Optionnel)
Si vous avez des profils orphelins, exécutez:
```sql
-- Vérifier si des profils existent sans school_id
SELECT id, email, full_name, school_id FROM public.users WHERE school_id IS NULL;

-- Si des résultats, assigner la première école:
UPDATE public.users 
SET school_id = (SELECT id FROM public.schools LIMIT 1)
WHERE school_id IS NULL;
```

### Étape 4: Tester l'Inscription
1. Accédez à http://localhost:3000/signup
2. Remplissez le formulaire:
   - **Nom complet:** Jean Dupont
   - **Email:** jean@example.com
   - **Mot de passe:** password123 (min 8 caractères)
3. Cliquez sur **"S'inscrire"**
4. Attendez le succès ✅

### Étape 5: Tester le Login
1. Allez à http://localhost:3000/login
2. Connectez-vous avec vos identifiants
3. Vérifiez que vous accédez au dashboard

## 🐛 Si Vous Rencontrez Toujours des Erreurs

### Erreur: "Cannot find SUPABASE_SERVICE_ROLE_KEY"
**Solution:** Vérifiez que `.env.local` contient:
```
NEXT_PUBLIC_SUPABASE_URL=https://eukkzsbmsyxgklzzhiej.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-key-here
```

Récupérez la clé depuis:
- Supabase Dashboard → Settings → API → Service Role Key (contient "secret")

### Erreur: "No schools found"
**Solution:** Créez une école d'abord
```sql
INSERT INTO public.schools (name, code) 
VALUES ('École Primaire', 'EP001');
```

### Erreur: Autres
Partagez l'erreur exacte et les logs du serveur (`npm run dev` output)

## 📋 Checklist Complète

- [ ] Migration SQL 031 exécutée dans Supabase
- [ ] Serveur redémarré (`npm run dev`)
- [ ] `.env.local` contient `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Au moins une école existe dans la base
- [ ] Test d'inscription réussi
- [ ] Test de login réussi
- [ ] Profil utilisateur visible dans Supabase (onglet users)

## 🎯 Résumé des Changes

| Fichier | Change |
|---------|--------|
| `supabase/migrations/031...` | Supprimer le trigger conflictuel |
| `src/app/api/auth/signup/route.ts` | Utiliser `upsert()` au lieu de `insert()` |

---

**Status:** ✅ Prêt à tester
**Temps estimé:** 5-10 minutes
