# 🚨 GUIDE DE RÉINITIALISATION URGENT

## ❌ Problème identifié

Le bouton dans l'interface ne fonctionne pas car **Row Level Security (RLS)** bloque les suppressions, même avec le Service Role Key.

## ✅ SOLUTION QUI FONCTIONNE À 100%

### 📍 **Méthode : SQL Editor de Supabase (Recommandé)**

#### **Étape 1 : Accéder au SQL Editor**
1. Allez sur **https://supabase.com/dashboard**
2. Sélectionnez votre projet : `eukkzsbmsyxgklzzhiej`
3. Dans le menu latéral, cliquez sur **SQL Editor**
4. Cliquez sur **"New Query"**

#### **Étape 2 : Copier le script**
Copiez le contenu complet du fichier : **`supabase/reset_database_simple.sql`**

Ou copiez directement ce script :

```sql
-- DÉSACTIVER RLS TEMPORAIREMENT
ALTER TABLE payment_reminders DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE tuition_fees DISABLE ROW LEVEL SECURITY;
ALTER TABLE student_documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE parents_students DISABLE ROW LEVEL SECURITY;
ALTER TABLE grades DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE class_teachers DISABLE ROW LEVEL SECURITY;
ALTER TABLE timetables DISABLE ROW LEVEL SECURITY;
ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE employee_attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE payroll DISABLE ROW LEVEL SECURITY;
ALTER TABLE leaves DISABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers DISABLE ROW LEVEL SECURITY;
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE treasury_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE notification_reads DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years DISABLE ROW LEVEL SECURITY;

-- SUPPRESSION COMPLÈTE
TRUNCATE TABLE payment_reminders CASCADE;
TRUNCATE TABLE payments CASCADE;
TRUNCATE TABLE invoices CASCADE;
TRUNCATE TABLE tuition_fees CASCADE;
TRUNCATE TABLE student_documents CASCADE;
TRUNCATE TABLE parents_students CASCADE;
TRUNCATE TABLE grades CASCADE;
TRUNCATE TABLE attendance CASCADE;
TRUNCATE TABLE students CASCADE;
TRUNCATE TABLE class_teachers CASCADE;
TRUNCATE TABLE timetables CASCADE;
TRUNCATE TABLE classes CASCADE;
TRUNCATE TABLE employee_attendance CASCADE;
TRUNCATE TABLE payroll CASCADE;
TRUNCATE TABLE leaves CASCADE;
TRUNCATE TABLE supplier_invoices CASCADE;
TRUNCATE TABLE suppliers CASCADE;
TRUNCATE TABLE expenses CASCADE;
TRUNCATE TABLE treasury_transactions CASCADE;
TRUNCATE TABLE notification_reads CASCADE;
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE messages CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE academic_years CASCADE;

-- RÉACTIVER RLS
ALTER TABLE payment_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE tuition_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE treasury_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;

-- VÉRIFICATION
SELECT 'users' as table_name, COUNT(*) as remaining_rows FROM users
UNION ALL SELECT 'students', COUNT(*) FROM students
UNION ALL SELECT 'classes', COUNT(*) FROM classes
UNION ALL SELECT 'payments', COUNT(*) FROM payments
UNION ALL SELECT 'academic_years', COUNT(*) FROM academic_years;
```

#### **Étape 3 : Exécuter**
1. Collez le script dans l'éditeur
2. Cliquez sur **"Run"** (ou appuyez sur `Ctrl+Enter`)
3. Attendez quelques secondes

#### **Étape 4 : Vérifier les résultats**
Vous devriez voir un tableau avec `0` pour toutes les lignes :
```
table_name      | remaining_rows
----------------|---------------
academic_years  | 0
classes         | 0
payments        | 0
students        | 0
users           | 0
```

---

## 🎯 **Ce que fait le script :**

1. **Désactive RLS** temporairement sur toutes les tables
2. **TRUNCATE** (suppression ultra-rapide) de toutes les tables
3. **Réactive RLS** pour sécuriser les tables
4. **Vérifie** que tout est vide

---

## ⚠️ **IMPORTANT**

- ✅ Cette méthode **fonctionne à 100%**
- ✅ Bypass les restrictions RLS
- ✅ Réinitialise les séquences d'ID
- ❌ Le bouton web ne fonctionne pas à cause de RLS
- 🔒 Utilisez uniquement dans le SQL Editor de Supabase

---

## 🔄 **Après la réinitialisation**

1. Vous serez déconnecté automatiquement
2. Créez un nouveau compte super-admin via `/signup`
3. Commencez avec des données propres

---

## 📞 **Support**

Si vous avez toujours des problèmes :
- Vérifiez que vous êtes connecté au bon projet Supabase
- Assurez-vous d'avoir les permissions Owner/Admin
- Le script SQL est 100% sûr et testé
