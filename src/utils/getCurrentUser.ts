import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

export async function getCurrentUser(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, 'public', any>
) {
  const { data: logedUserData } = await supabase.auth.getUser();
  const userEmail = logedUserData.user?.email;
  const { data: userData } = await supabase
    .from('tb_users')
    .select()
    .eq('email', userEmail)
    .single();

  return userData;
}
