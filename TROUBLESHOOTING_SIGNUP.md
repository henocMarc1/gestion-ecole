# 🔧 Guide Complet - Inscription & Initialisation

## ⚠️ SITUATION ACTUELLE

L'application rencontre l'erreur **"User profile not found after retry"** lors du login après une réinitialisation de la base.

**Cause racine:** 
- Trigger automatique conflictuel
- Base de données mal initialisée
- RLS policies bloquant les requêtes

---

## 🚀 SOLUTION COMPLÈTE (Étapes à suivre)

### **PHASE 1: NETTOYER LA BASE DE DONNÉES** ⚠️

#### Étape 1.1 - Exécuter la Migration de Reset

1. Ouvrez [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre **projet**
3. Allez à **SQL Editor** → cliquez **New Query**
4. **Copiez/collez ce code:**

```sql
-- 1️⃣ SUPPRIMER LE TRIGGER CONFLICTUEL
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2️⃣ DÉSACTIVER RLS (pour nettoyer)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 3️⃣ SUPPRIMER LES DONNÉES ORPHELINES
DELETE FROM public.users 
WHERE id NOT IN (SELECT id FROM auth.users);

-- 4️⃣ RÉACTIVER RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

5. Cliquez le bouton **Run** (ou Ctrl+Enter)
6. Attendez ✅ **"Query executed successfully"**

#### Étape 1.2 - Créer une École (OBLIGATOIRE!)

L'API ne peut pas créer de profil sans au moins une école. Exécutez:

1. Allez à **SQL Editor** → **New Query**
2. **Copiez/collez:**

```sql
INSERT INTO public.schools (name, code, created_at, updated_at)
VALUES (
  'École Primaire par Défaut', 
  'ECOLE_DEFAULT_001', 
  NOW(), 
  NOW()
)
ON CONFLICT (code) DO NOTHING;

-- Vérifier que l'école a été créée
SELECT id, name, code FROM public.schools;
```

3. Cliquez **Run**
4. Vous devez voir au moins une ligne de résultat ✅

---

### **PHASE 2: CONFIGURER .env.local** ⚙️

#### Étape 2.1 - Ajouter la Service Role Key

1. Appelez `.env.local` dans votre éditeur VS Code
2. Trouvez la ligne:
```
SUPABASE_SERVICE_ROLE_KEY=???
```

3. **Si elle est vide ou manque**, cherchez votre clé:
   - Allez à Supabase Dashboard
   - Allez à **Settings** → **API**
   - Sous **Project API keys**, trouvez **Service Role** (pas de "secret" dans le nom)
   - Copiez la clé (commence par `eyJh...`)
   - Remplacez `???` par cette clé

4. Le fichier doit ressembler à:
```env
NEXT_PUBLIC_SUPABASE_URL=https://eukkzsbmsyxgklzzhiej.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

5. **Sauvegardez** (Ctrl+S)

---

### **PHASE 3: REDÉMARRER LE SERVEUR** 🔄

1. Dans le terminal VS Code, **arrêtez** le serveur (Ctrl+C)
2. **Attendez** que le terminal affiche:
   ```
   > app-name@1.0.0 dev
   >...
   ```
3. **Redémarrez:**
```powershell
npm run dev
```

4. **Attendez** que le serveur soit prêt:
   ```
   ▲ Next.js ...
   - ready started server on...
   ```

---

### **PHASE 4: TESTER L'INSCRIPTION** ✅

#### Étape 4.1 - Accéder au Formulaire

1. Ouvrez votre navigateur
2. Allez à: **http://localhost:3000/signup**
3. Vous devez voir un formulaire avec:
   - Nom complet
   - Email
   - Mot de passe
   - Confirmer mot de passe

#### Étape 4.2 - Remplir et Soumettre

**Remplissez avec:**
```
Nom complet: Jean Dupont
Email: jean.dupont@test.com
Mot de passe: TestPassword123
Confirmer: TestPassword123
```

1. Cliquez **S'inscrire**
2. **Attendez** 2-3 secondes
3. **Vous devez voir:**
   - Toast ✅ "Compte SuperAdmin créé avec succès!"
   - Redirection auto vers login

#### Étape 4.3 - Tester le Login

1. Vous êtes maintenant sur **http://localhost:3000/login**
2. Connectez-vous avec:
   ```
   Email: jean.dupont@test.com
   Mot de passe: TestPassword123
   ```
3. Cliquez **Se connecter**
4. **Vous devez être redirigé au dashboard** ✅

---

### **PHASE 5: VÉRIFIER DANS SUPABASE** 🔍

Pour confirmer que tout fonctionne:

1. Allez à Supabase Dashboard
2. Allez à **Table Editor**
3. Sélectionnez **users**
4. **Vous devez voir votre profil:**
   - `id` = UUID (ex: 550e8400-e29b-41d4-a716-...)
   - `email` = jean.dupont@test.com
   - `full_name` = Jean Dupont
   - `school_id` = ID de l'école (pas NULL!)
   - `role` = SUPER_ADMIN
   - `is_active` = true

---

## 🐛 DÉPANNAGE - ERREURS COUANTES

### ❌ Erreur: "POST .../signup 500 (Internal Server Error)"

**Cause probable:** `SUPABASE_SERVICE_ROLE_KEY` manquante ou incorrecte

**Solution:**
1. Vérifiez `.env.local`
2. Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` n'est pas vide
3. Assurez-vous d'avoir redémarré (`npm run dev`)

---

### ❌ Erreur: "User profile not found after retry"

**Cause probable:** Pas d'école créée dans la base

**Solution:**
1. Allez à Supabase SQL Editor
2. Exécutez:
```sql
SELECT COUNT(*) FROM public.schools;
```
3. Si le résultat est **0**, créez une école (voir Étape 1.2)

---

### ❌ Erreur: "Aucune école trouvée"

Exactement le même problème que ci-dessus. Créez une école!

---

### ❌ Erreur: "GET .../users?... 406 (Not Acceptable)"

**Cause probable:** Problème RLS

**Solution:**
1. Allez à Supabase SQL Editor
2. Exécutez:
```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```
3. Redémarrez le serveur (`npm run dev`)

---

### ❌ Erreur: "Email already exists"

C'est normal si vous avez déjà créé un compte avec cet email.

**Solution:**
- Utilisez un autre email (ex: jean.dupont.2@test.com)

---

## ✅ CHECKLIST FINALE

Avant de déclarer que ça fonctionne:

- [ ] **Migration SQL exécutée** (étape 1.1)
- [ ] **École créée** (étape 1.2)
- [ ] **`.env.local` configuré** avec SERVICE_ROLE_KEY (étape 2)
- [ ] **Serveur redémarré** (`npm run dev`)
- [ ] **Inscription réussie** sans erreur
- [ ] **Login réussi** après inscription
- [ ] **Profil visible** dans Supabase table users

---

## 📋 FICHIERS MODIFIÉS

| Fichier | Rôle |
|---------|------|
| `supabase/migrations/031_remove_conflicting_trigger.sql` | Supprime le trigger |
| `supabase/migrations/032_complete_reset.sql` | Reset complet |
| `src/app/api/auth/signup/route.ts` | Upsert du profil |
| `src/app/signup/page.tsx` | Appel API au lieu de client |
| `.env.local` | Configuration clés |

---

## 🎯 RÉSUMÉ

| Étape | Action | Temps |
|-------|--------|-------|
| 1.1 | Reset SQL | 30s |
| 1.2 | Créer école | 30s |
| 2 | Config `.env.local` | 1m |
| 3 | Restart serveur | 1m |
| 4 | Test inscription | 2m |
| 5 | Vérifier Supabase | 1m |
| **Total** | | **~6 minutes** |

---

**Status:** 🟢 Prêt à utiliser
**Version:** 2.0
**Date:** 16 Février 2026
