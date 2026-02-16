import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * API Route pour l'inscription de nouveaux utilisateurs
 * Utilise le service role key pour bypasser RLS
 */
export async function POST(request: NextRequest) {
  try {
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
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
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

    // 2. Créer le profil dans public.users (avec service role, bypass RLS)
    const { error: dbError } = await supabaseAdmin.from('users').upsert({
      id: authData.user.id,
      email: email,
      full_name: fullName,
      role: 'SUPER_ADMIN',
      is_active: true,
      must_change_password: false,
    }, {
      onConflict: 'id', // Si l'ID existe déjà, le mettre à jour
    });

    if (dbError) {
      console.error('Database error:', dbError);
      // Ne pas supprimer l'utilisateur auth car le profil existe peut-être déjà
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
