import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// ⚠️ ROUTE ULTRA-SENSIBLE - Vérifications de sécurité strictes
export async function POST(request: NextRequest) {
  try {
    // 1. Vérifier l'authentification
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // 2. Créer client Supabase avec service role (permissions admin)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 3. Vérifier que l'utilisateur est bien un SUPER_ADMIN
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    // 4. Vérifier le rôle
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError || userData?.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès refusé. Seuls les SUPER_ADMIN peuvent réinitialiser la base.' },
        { status: 403 }
      );
    }

    // 5. Récupérer la confirmation du corps de la requête
    const body = await request.json();
    if (body.confirmation !== 'SUPPRIMER TOUTES LES DONNEES') {
      return NextResponse.json(
        { error: 'Confirmation invalide' },
        { status: 400 }
      );
    }

    // 6. Exécuter le script de réinitialisation
    const resetScript = `
-- Suppression de toutes les données
DELETE FROM payment_reminders WHERE true;
DELETE FROM payments WHERE true;
DELETE FROM invoices WHERE true;
DELETE FROM tuition_fees WHERE true;
DELETE FROM student_documents WHERE true;
DELETE FROM parents_students WHERE true;
DELETE FROM grades WHERE true;
DELETE FROM attendance WHERE true;
DELETE FROM students WHERE true;
DELETE FROM class_teachers WHERE true;
DELETE FROM timetables WHERE true;
DELETE FROM classes WHERE true;
DELETE FROM employee_attendance WHERE true;
DELETE FROM payroll WHERE true;
DELETE FROM leaves WHERE true;
DELETE FROM supplier_invoices WHERE true;
DELETE FROM suppliers WHERE true;
DELETE FROM expenses WHERE true;
DELETE FROM treasury_transactions WHERE true;
DELETE FROM notification_reads WHERE true;
DELETE FROM notifications WHERE true;
DELETE FROM messages WHERE true;
DELETE FROM users WHERE true;
DELETE FROM academic_years WHERE true;
    `;

    const { error: sqlError } = await supabaseAdmin.rpc('exec_sql', {
      sql: resetScript,
    });

    // Si la fonction RPC n'existe pas, on exécute manuellement
    if (sqlError?.message?.includes('function') || sqlError?.code === '42883') {
      // Exécution manuelle table par table
      const tables = [
        'payment_reminders',
        'payments',
        'invoices',
        'tuition_fees',
        'student_documents',
        'parents_students',
        'grades',
        'attendance',
        'students',
        'class_teachers',
        'timetables',
        'classes',
        'employee_attendance',
        'payroll',
        'leaves',
        'supplier_invoices',
        'suppliers',
        'expenses',
        'treasury_transactions',
        'notification_reads',
        'notifications',
        'messages',
        'users',
        'academic_years',
      ];

      const results = [];
      for (const table of tables) {
        try {
          const { count, error } = await supabaseAdmin
            .from(table)
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

          if (!error) {
            results.push({ table, deleted: count || 0 });
          }
        } catch (e) {
          // Ignorer les tables qui n'existent pas
          console.log(`Table ${table} ignorée:`, e);
        }
      }

      return NextResponse.json({
        success: true,
        message: '🗑️ Base de données réinitialisée avec succès',
        details: results,
        timestamp: new Date().toISOString(),
      });
    }

    if (sqlError) {
      throw sqlError;
    }

    // 7. Vérifier que les tables sont vides
    const { count: usersCount } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: studentsCount } = await supabaseAdmin
      .from('students')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      message: '🗑️ Base de données réinitialisée avec succès',
      verification: {
        users: usersCount || 0,
        students: studentsCount || 0,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Erreur lors de la réinitialisation:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la réinitialisation',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
