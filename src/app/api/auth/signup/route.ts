import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * API Route pour l'inscription de nouveaux utilisateurs
 * Utilise le service role key pour bypasser RLS
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier les variables d'environnement
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('Missing NEXT_PUBLIC_SUPABASE_URL');
      return NextResponse.json(
        { error: 'Configuration serveur incomplète: NEXT_PUBLIC_SUPABASE_URL manquante' },
        { status: 500 }
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
      return NextResponse.json(
        { error: 'Configuration serveur incomplète: SUPABASE_SERVICE_ROLE_KEY manquante' },
        { status: 500 }
      );
    }

    const { email, password, fullName } = await request.json();

    // Validation
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Client Supabase avec service role (bypass RLS)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 1. Créer l'utilisateur dans auth.users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirmer l'email automatiquement
      user_metadata: {
        full_name: fullName,
      },
    });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Erreur lors de la création du compte' },
        { status: 500 }
      );
    }

    // 2. Récupérer la première école (pour l'assigner au nouveau profil)
    const { data: schools, error: schoolError } = await supabaseAdmin
      .from('schools')
      .select('id')
      .limit(1);

    if (schoolError || !schools || schools.length === 0) {
      console.error('No schools found:', schoolError);
      // Supprimer l'utilisateur auth si pas d'école
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Aucune école trouvée. Veuillez créer une école d\'abord.' },
        { status: 500 }
      );
    }

    const schoolId = schools[0].id;

    // 3. Créer ou mettre à jour le profil dans public.users (avec school_id)
    // Utiliser un upsert pour éviter les erreurs de clé dupliquée
    const { error: dbError } = await supabaseAdmin.from('users').upsert({
      id: authData.user.id,
      email: email,
      full_name: fullName,
      role: 'SUPER_ADMIN',
      school_id: schoolId, // Assigner à la première école
      is_active: true,
      must_change_password: false,
    }, {
      onConflict: 'id', // Si l'ID existe déjà, mettre à jour
    });

    if (dbError) {
      console.error('Database error:', dbError);
      // Supprimer l'utilisateur auth si l'insertion échoue
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Erreur lors de la création du profil: ' + dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur inconnue' },
      { status: 500 }
    );
  }
}