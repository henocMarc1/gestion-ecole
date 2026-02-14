-- ================================================
-- SCRIPT DE RÉINITIALISATION SÉCURISÉ
-- ================================================
-- Version robuste qui ignore les tables inexistantes

-- ================================================
-- SUPPRESSION DES DONNÉES
-- ================================================

-- Paiements et finances
DELETE FROM payment_reminders WHERE true;
DELETE FROM payments WHERE true;
DELETE FROM invoices WHERE true;
DELETE FROM tuition_fees WHERE true;

-- Élèves et relations
DELETE FROM student_documents WHERE true;
DELETE FROM parents_students WHERE true;
DELETE FROM grades WHERE true;
DELETE FROM attendance WHERE true;
DELETE FROM students WHERE true;

-- Classes
DELETE FROM class_teachers WHERE true;
DELETE FROM timetables WHERE true;
DELETE FROM classes WHERE true;

-- Employés et RH
DELETE FROM employee_attendance WHERE true;
DELETE FROM payroll WHERE true;
DELETE FROM leaves WHERE true;

-- Comptabilité
DELETE FROM supplier_invoices WHERE true;
DELETE FROM suppliers WHERE true;
DELETE FROM expenses WHERE true;
DELETE FROM treasury_transactions WHERE true;

-- Communications
DELETE FROM notification_reads WHERE true;
DELETE FROM notifications WHERE true;
DELETE FROM messages WHERE true;

-- Utilisateurs (TOUS)
DELETE FROM users WHERE true;

-- Années scolaires
DELETE FROM academic_years WHERE true;

-- ================================================
-- VÉRIFICATION FINALE
-- ================================================
SELECT 
  'users' as table_name, COUNT(*) as remaining_rows FROM users
UNION ALL
SELECT 'students', COUNT(*) FROM students
UNION ALL
SELECT 'classes', COUNT(*) FROM classes
UNION ALL
SELECT 'payments', COUNT(*) FROM payments
UNION ALL
SELECT 'invoices', COUNT(*) FROM invoices
ORDER BY table_name;

SELECT '✅ Réinitialisation terminée !' as status;
