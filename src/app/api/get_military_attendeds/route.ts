import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  try {
    if (q) {
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
        .neq('rg', null)
        .or(`rg.ilike.%${q}%, fullname.ilike.%${q}%`)
        .limit(10);

      let formattedData = null;

      if (attendeds) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formattedData = attendeds.map((e: any) => {
          return {
            id: e.id,
            fullname: e.fullname,
            nickname: e.nickname,
            rg: e.rg,
            rank: e.tb_ranks.name,
            cadre: e.tb_cadres.name,
            cpf: e.cpf
          };
        });
      }

      return Response.json(formattedData);
    } else {
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
        .neq('rg', null)
        .limit(10);

      let formattedData = null;

      if (attendeds) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formattedData = attendeds.map((e: any) => {
          return {
            id: e.id,
            fullname: e.fullname,
            nickname: e.nickname,
            rg: e.rg,
            rank: e.tb_ranks.name,
            cadre: e.tb_cadres.name,
            cpf: e.cpf
          };
        });
      }

      return Response.json(formattedData);
    }
  } catch (error) {
    return Response.json(`select data error: ${error}`, { status: 400 });
  }
}
