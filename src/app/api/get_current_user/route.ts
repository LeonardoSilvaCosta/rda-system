import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  try {
    const { data: currentUser } = await supabase
      .from('tb_users')
      .select(
        `
    id, 
    fullname,
    nickname,
    rg,
    cpf,
    tb_ranks ( name ),
    tb_cadres ( name ),
    `
      )
      .eq('email', email)
      .single();

    return Response.json(currentUser);
  } catch (error) {
    return Response.json(`select data error: ${error}`, { status: 400 });
  }
}
