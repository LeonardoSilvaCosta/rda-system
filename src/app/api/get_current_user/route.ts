import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

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

    alert(currentUser);

    return Response.json(currentUser);
  } catch (error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }
}
