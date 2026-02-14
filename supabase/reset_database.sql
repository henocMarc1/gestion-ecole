-- ================================================
-- SCRIPT DE RÉINITIALISATION DE LA BASE DE DONNÉES
-- ================================================
-- ⚠️ ATTENTION: Ce script supprime TOUTES les données de test
-- Utilisez-le avec précaution !

BEGIN;

-- Désactiver temporairement les contraintes de clés étrangères
SET CONSTRAINTS ALL DEFERRED;

-- ================================================
-- SUPPRESSION DES DONNÉES (ordre inverse des dépendances)
-- ================================================

-- 1. Suppressions liées aux paiements
DELETE FROM payment_reminders;
DELETE FROM payment_history;
DELETE FROM payments;
DELETE FROM invoices;
DELETE FROM tuition_fees;

-- 2. Suppressions liées aux élèves
DELETE FROM student_documents;
DELETE FROM parents_students;
DELETE FROM grades;
DELETE FROM attendance;
DELETE FROM students;

-- 3. Suppressions liées aux classes
DELETE FROM class_teachers;
DELETE FROM timetables;
DELETE FROM classes;

-- 4. Suppressions liées aux employés
DELETE FROM employee_attendance;
DELETE FROM payroll;
DELETE FROM leaves;

-- 5. Suppressions liées à la comptabilité
DELETE FROM supplier_invoices;
DELETE FROM suppliers;
DELETE FROM expenses;
DELETE FROM treasury_transactions;

-- 6. Suppressions liées aux messages/notifications
DELETE FROM notification_reads;
DELETE FROM notifications;
DELETE FROM messages;

-- 7. Suppression des utilisateurs (sauf super-admin si besoin)
-- ⚠️ DÉCOMMENTEZ LA LIGNE CI-DESSOUS POUR SUPPRIMER TOUS LES UTILISATEURS
-- DELETE FROM users WHERE role != 'SUPER_ADMIN';

-- OU supprimez TOUS les utilisateurs (y compris super-admin)
DELETE FROM users;

-- 8. Suppressions liées aux années scolaires
DELETE FROM academic_years;

-- 9. Suppressions liées aux écoles (si vous voulez tout réinitialiser)
-- ⚠️ DÉCOMMENTEZ SI VOUS VOULEZ AUSSI SUPPRIMER LES ÉCOLES
-- DELETE FROM schools;

-- ================================================
-- RÉINITIALISATION DES SÉQUENCES
-- ================================================
-- Réinitialise les compteurs auto-incrémentés

-- Exemple pour les IDs (si vous utilisez des séquences)
-- ALTER SEQUENCE students_id_seq RESTART WITH 1;
-- ALTER SEQUENCE users_id_seq RESTART WITH 1;

-- ================================================
-- VÉRIFICATION
-- ================================================
-- Comptage des lignes restantes
SELECT 
  'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'students', COUNT(*) FROM students
UNION ALL
SELECT 'classes', COUNT(*) FROM classes
UNION ALL
SELECT 'payments', COUNT(*) FROM payments
UNION ALL
SELECT 'invoices', COUNT(*) FROM invoices
UNION ALL
SELECT 'grades', COUNT(*) FROM grades
UNION ALL
SELECT 'attendance', COUNT(*) FROM attendance
ORDER BY table_name;

-- ================================================
-- CONFIRMATION
-- ================================================
-- Si tout est bon, exécutez : COMMIT;
-- Si vous voulez annuler : ROLLBACK;

COMMIT;

-- ================================================
-- MESSAGE DE FIN
-- ================================================
SELECT '✅ Base de données réinitialisée avec succès !' as status;
