# 🔑 Configuration des variables d'environnement

## ⚠️ Problème

L'API d'inscription nécessite `SUPABASE_SERVICE_ROLE_KEY` qui n'est **pas configurée en local**.

## ✅ Solution (5 minutes)

### Étape 1️⃣ : Récupérer les clés Supabase

1. **Ouvrir Supabase Dashboard** : https://supabase.com/dashboard/project/eukkzsbmsyxgklzzhiej

2. **Aller à Settings → API** (en bas à gauche)

3. **Trouver ces clés** :
   - ✅ **Project Reference** : `eukkzsbmsyxgklzzhiej`
   - ✅ **Project URL** : `https://eukkzsbmsyxgklzzhiej.supabase.co`
   - ✅ **Anon Key** : (Publique, safe)
   - ✅ **Service Role Key** : ⚠️ **PRIVATE** ne pas partager !

---

### Étape 2️⃣ : Créer le fichier `.env.local`

Dans votre dossier projet racine, créer un fichier `.env.local` :

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://eukkzsbmsyxgklzzhiej.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=vôtre_anon_key_ici
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Étape 3️⃣ : Redémarrer le serveur

Arrêter et redémarrer `npm run dev` (ou `yarn dev`)

---

## 🎯 Résultat

L'API `/api/auth/signup` fonctionnera maintenant localement ! ✅

---

## ⚠️ Sécurité

❌ **NE JAMAIS** copier `SUPABASE_SERVICE_ROLE_KEY` dans Git
✅ Le fichier `.env.local` est dans `.gitignore`
✅ Seulement besoin en local ou sur Vercel (via Environment Variables)

---

## 🚀 Pour Vercel (production)

Les variables d'environnement sont déjà configurées via :
1. Vercel Dashboard → Settings → Environment Variables
2. Ne rien à faire ici 👍

---

## 🔍 Dépannage

### Erreur : "Configuration serveur incomplète"

Vérifier que `.env.local` contient :
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

### Erreur d'authentification

Vérifier que les clés sont correctes dans Supabase Dashboard

### Pas de changement après modification

Redémarrer le serveur `npm run dev`
