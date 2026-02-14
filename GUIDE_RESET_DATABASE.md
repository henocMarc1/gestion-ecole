# 🔄 Guide de Réinitialisation de la Base de Données

## ⚠️ ATTENTION 
**Ce processus supprime TOUTES les données de test. Utilisez avec précaution !**

---

## 📋 Étapes pour réinitialiser la base de données

### Méthode 1 : Via Supabase Dashboard (Recommandé)

1. **Connectez-vous à Supabase**
   - Allez sur : https://app.supabase.com
   - Sélectionnez votre projet

2. **Ouvrez l'éditeur SQL**
   - Menu de gauche → **SQL Editor**
   - Cliquez sur **New Query**

3. **Copiez le script**
   - Ouvrez le fichier `supabase/reset_database.sql`
   - Copiez TOUT le contenu

4. **Exécutez le script**
   - Collez le script dans l'éditeur SQL
   - Cliquez sur **Run** (ou Ctrl+Enter)
   - ✅ Vérifiez les résultats

5. **Vérification**
   - Le script affiche le nombre de lignes restantes dans chaque table
   - Tout devrait être à 0 (sauf si vous avez gardé le super-admin)

---

### Méthode 2 : Script personnalisé

Si vous voulez garder certains utilisateurs (comme un admin) :

```sql
-- Garder le super-admin
DELETE FROM users WHERE role != 'SUPER_ADMIN';

-- OU garder un utilisateur spécifique par email
DELETE FROM users WHERE email != 'votre-admin@example.com';
```

---

## 🎯 Tables affectées

Le script supprime les données de :

### Données principales
- ✅ **users** - Tous les utilisateurs
- ✅ **students** - Tous les élèves
- ✅ **classes** - Toutes les classes
- ✅ **academic_years** - Années scolaires

### Données financières
- ✅ **payments** - Tous les paiements
- ✅ **invoices** - Toutes les factures
- ✅ **tuition_fees** - Frais de scolarité
- ✅ **expenses** - Dépenses
- ✅ **treasury_transactions** - Transactions trésorerie

### Données pédagogiques
- ✅ **grades** - Notes
- ✅ **attendance** - Présences
- ✅ **timetables** - Emplois du temps

### Données RH
- ✅ **employee_attendance** - Présences employés
- ✅ **payroll** - Paies
- ✅ **leaves** - Congés

### Autres
- ✅ **notifications** - Notifications
- ✅ **messages** - Messages
- ✅ **suppliers** - Fournisseurs

---

## 🔒 Que se passe-t-il après ?

### La structure reste intacte
- ✅ Tables toujours présentes
- ✅ Colonnes préservées
- ✅ Contraintes maintenues
- ✅ Index conservés
- ✅ Functions/Triggers actifs

### Vous pouvez recommencer à zéro
1. Créez un nouveau compte super-admin
2. Créez une nouvelle école
3. Ajoutez de vrais utilisateurs
4. Importez de vraies données

---

## 🚨 En cas de problème

Si le script échoue :

### Erreur de contraintes
```sql
-- Ajoutez cette ligne au début du script
SET CONSTRAINTS ALL DEFERRED;
```

### Erreur de permissions
- Assurez-vous d'utiliser le compte **service_role**
- Dans Supabase Dashboard, vous avez les droits par défaut

### Annuler les changements
Si vous n'avez pas encore fait COMMIT :
```sql
ROLLBACK;
```

---

## ✅ Vérification post-réinitialisation

Après l'exécution, vérifiez :

```sql
-- Comptez les lignes dans les tables principales
SELECT 
  'users' as table, COUNT(*) as count FROM users
UNION ALL
SELECT 'students', COUNT(*) FROM students
UNION ALL
SELECT 'classes', COUNT(*) FROM classes
UNION ALL
SELECT 'payments', COUNT(*) FROM payments;
```

Tout devrait être à **0**.

---

## 🎉 Prêt à recommencer

Une fois la base vidée :

1. **Créez un compte admin**
   - Via `/signup` sur votre application
   - Ou directement dans Supabase

2. **Ajoutez votre école**
   - Menu Super Admin → Schools

3. **Importez vos vraies données**
   - Via l'interface d'administration
   - Ou via import CSV/Excel

---

## 📞 Support

En cas de problème, contactez votre administrateur système ou consultez la documentation Supabase.
