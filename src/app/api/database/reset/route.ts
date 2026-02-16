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
        db: {
          schema: 'public',
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

    // 6. Exécution de la réinitialisation
    const results = [];
    let totalDeleted = 0;

    // Ordre de suppression pour respecter les contraintes FK
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

    for (const table of tables) {
      try {
        // Compter avant
        const { count: beforeCount, error: countError } = await supabaseAdmin
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (countError) {
          console.error(`Erreur comptage ${table}:`, countError);
          results.push({ table, deleted: 0, status: 'error', error: countError.message });
          continue;
        }

        // Supprimer avec une requête qui match toujours (id IS NOT NULL)
        const { error: deleteError } = await supabaseAdmin
          .from(table)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Condition qui match tout

        if (deleteError) {
          console.error(`Erreur suppression ${table}:`, deleteError);
          results.push({ table, deleted: 0, status: 'error', error: deleteError.message });
        } else {
          const deleted = beforeCount || 0;
          totalDeleted += deleted;
          results.push({ table, deleted, status: 'success' });
          console.log(`✅ ${table}: ${deleted} lignes supprimées`);
        }
      } catch (e: any) {
        console.log(`⚠️ Erreur ${table}:`, e.message);
        results.push({ table, deleted: 0, status: 'error', error: e.message });
      }
    }

    // 7. Vérifier que les tables principales sont vides
    const { count: usersCount } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: studentsCount } = await supabaseAdmin
      .from('students')
      .select('*', { count: 'exact', head: true });

    const { count: classesCount } = await supabaseAdmin
      .from('classes')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      message: `🗑️ ${totalDeleted} lignes supprimées avec succès`,
      details: results,
      verification: {
        users: usersCount || 0,
        students: studentsCount || 0,
        classes: classesCount || 0,
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
