import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { Database } from '@/types/supabase';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  try {
    const { data: currentUser } = await supabase
      .from('tb_users')
      .select(
        `
    id, 
    avatar,
    fullname,
    nickname,
    rg,
    cpf,
    tb_ranks ( name ),
    tb_cadres ( name )
    `
      )
      .eq('email', String(email))
      .single();

    if (!currentUser) {
      Response.json('Usuário não encontrado');
      return;
    }

    const formattedData = {
      id: currentUser.id,
      avatar: currentUser.avatar ? currentUser.avatar : '',
      fullname: currentUser?.fullname,
      nickname: currentUser?.nickname,
      rg: currentUser.rg,
      cpf: currentUser.cpf,
      rank: currentUser.tb_ranks ? currentUser?.tb_ranks.name : null,
      cadre: currentUser.tb_cadres ? currentUser?.tb_cadres.name : null
    };

    return Response.json(formattedData);
  } catch (error) {
    return Response.json(`select data error: ${error}`, { status: 400 });
  }
}
