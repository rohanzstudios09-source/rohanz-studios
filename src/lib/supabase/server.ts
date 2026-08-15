import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}

export async function getAuthenticatedAdminUser() {
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project')) {
    return null;
  }
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;

    // Verify admin identity server-side against admin_profiles or fallback email
    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'rohanzstudios09@gmail.com';
    const isAdminByRole = profile?.role === 'admin';
    const isAdminByEmail = user.email?.toLowerCase() === adminEmail.toLowerCase();

    if (isAdminByRole || isAdminByEmail) {
      return user;
    }
    return null;
  } catch (err) {
    console.error('[Server Auth] Error verifying authenticated admin:', err);
    return null;
  }
}
