-- ================================================
-- SCRIPT DE RÉINITIALISATION ULTRA-PUISSANT
-- ================================================
-- Version robuste qui ignore les tables inexistantes

-- ⚠️ ATTENTION: Cette action est IRRÉVERSIBLE
-- Toutes les données seront DÉFINITIVEMENT supprimées

-- ================================================
-- DÉSACTIVER RLS ET SUPPRIMER (avec gestion d'erreurs)
-- ================================================

DO $$
DECLARE
  r RECORD;
BEGIN
  -- Désactiver RLS sur toutes les tables existantes
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    EXECUTE 'ALTER TABLE ' || quote_ident(r.tablename) || ' DISABLE ROW LEVEL SECURITY';
    RAISE NOTICE 'RLS désactivé sur: %', r.tablename;
  END LOOP;
  
  -- Liste des tables à vider (on ignore celles qui n'existent pas)
  BEGIN
    TRUNCATE TABLE payment_reminders CASCADE;
    RAISE NOTICE 'Table payment_reminders vidée';
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table payment_reminders ignorée (inexistante)';
  END;
  
  BEGIN
    TRUNCATE TABLE payments CASCADE;
    RAISE NOTICE 'Table payments vidée';
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table payments ignorée (inexistante)';
  END;
  
  BEGIN
    TRUNCATE TABLE invoices CASCADE;
    RAISE NOTICE 'Table invoices vidée';
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table invoices ignorée (inexistante)';
  END;
  
  BEGIN
    TRUNCATE TABLE tuition_fees CASCADE;
    RAISE NOTICE 'Table tuition_fees vidée';
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table tuition_fees ignorée (inexistante)';
  END;
  
  BEGIN
    TRUNCATE TABLE parents_students CASCADE;
    RAISE NOTICE 'Table parents_students vidée';
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table parents_students ignorée (inexistante)';
  END;
  
  BEGIN
    TRUNCATE TABLE grades CASCADE;
    RAISE NOTICE 'Table grades vidée';
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table grades ignorée (inexistante)';
  END;
  
  BEGIN
    TRUNCATE TABLE attendance CASCADE;
    RAISE NOTICE 'Table attendance vidée';
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table attendance ignorée (inexistante)';
  END;
  
  BEGIN
    TRUNCATE TABLE students CASCADE;
    RAISE NOTICE 'Table students vidée';
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table students ignorée (inexistante)';
  END;
  
  BEGIN
    TRUNCATE TABLE class_teachers CASCADE;
    RAISE NOTICE 'Table class_teachers vidée';
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table class_teachers ignorée (inexistante)';
  END;
  
  BEGIN
    TRUNCATE TABLE timetables CASCADE;
    RAISE NOTICE 'Table timetables vidée';
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table timetables ignorée (inexistante)';
  END;
  
  BEGIN
    TRUNCATE TABLE classes CASCADE;
    RAISE NOTICE 'Table classes vidée';
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table classes ignorée (inexistante)';
  END;
  
  BEGIN
    TRUNCATE TABLE employee_attendance CASCADE;
    RAISE NOTICE 'Table employee_attendance vidée';
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table employee_attendance ignorée (inexistante)';
  END;
  
  BEGIN
    TRUNCATE TABLE payroll CASCADE;
    RAISE NOTICE 'Table payroll vidée';
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table payroll ignorée (inexistante)';
  END;
  
  BEGIN
    TRUNCATE TABLE leaves CASCADE;
    RAISE NOTICE 'Table leaves vidée';
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table leaves ignorée (inexistante)';
  END;
  
  BEGIN
    TRUNCATE TABLE supplier_invoices CASCADE;
    RAISE NOTICE 'Table supplier_invoices vidée';
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table supplier_invoices ignorée (inexistante)';
  END;
  
  BEGIN
    TRUNCATE TABLE suppliers CASCADE;
    RAISE NOTICE 'Table suppliers vidée';
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table suppliers ignorée (inexistante)';
  END;
  
  BEGIN
    TRUNCATE TABLE expenses CASCADE;
    RAISE NOTICE 'Table expenses vidée';
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table expenses ignorée (inexistante)';
  END;
  
  BEGIN
    TRUNCATE TABLE treasury_transactions CASCADE;
    RAISE NOTICE 'Table treasury_transactions vidée';
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table treasury_transactions ignorée (inexistante)';
  END;
  
  BEGIN
    TRUNCATE TABLE notification_reads CASCADE;
    RAISE NOTICE 'Table notification_reads vidée';
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table notification_reads ignorée (inexistante)';
  END;
  
  BEGIN
    TRUNCATE TABLE notifications CASCADE;
    RAISE NOTICE 'Table notifications vidée';
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table notifications ignorée (inexistante)';
  END;
  
  BEGIN
    TRUNCATE TABLE messages CASCADE;
    RAISE NOTICE 'Table messages vidée';
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table messages ignorée (inexistante)';
  END;
  
  BEGIN
    TRUNCATE TABLE users CASCADE;
    RAISE NOTICE 'Table users vidée';
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table users ignorée (inexistante)';
  END;
  
  BEGIN
    TRUNCATE TABLE academic_years CASCADE;
    RAISE NOTICE 'Table academic_years vidée';
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Table academic_years ignorée (inexistante)';
  END;
  
  -- Réactiver RLS sur toutes les tables
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    EXECUTE 'ALTER TABLE ' || quote_ident(r.tablename) || ' ENABLE ROW LEVEL SECURITY';
    RAISE NOTICE 'RLS réactivé sur: %', r.tablename;
  END LOOP;
  
END $$;

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
UNION ALL
SELECT 'academic_years', COUNT(*) FROM academic_years
ORDER BY table_name;

SELECT '✅ Réinitialisation terminée - Toutes les tables sont vides !' as status;
