import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: attendeds } = await supabase
      .from('tb_attendeds')
      .select(
        `
    id, 
    fullname,
    nickname,
    rg,
    cpf,
    tb_ranks ( name ),
    tb_cadres ( name )
    `
      )
      .limit(10);

    let formattedData = null;

    if (attendeds) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formattedData = attendeds.map((e: any) => {
        return {
          id: e.id,
          fullname: e.fullname,
          nickname: e.nickname ? e.nickname : null,
          rg: e.rg ? e.rg : null,
          rank: e.tb_ranks ? e.tb_ranks.name : null,
          cadre: e.tb_cadres ? e.tb_cadres.name : null,
          cpf: e.cpf
        };
      });
    }

    return Response.json(formattedData);
  } catch (error) {
    return Response.json(`select data error: ${error}`, { status: 400 });
  }
}
