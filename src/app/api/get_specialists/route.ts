import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import errorMessages from '@/config/errorMessages';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const QCOPMId = 'df4281a9-d27f-42b8-baf9-fcf9d58d055e';

  try {
    if (q) {
      const { data: specialists, error } = await supabase
        .rpc('get_specialists_by_query', {
          q_input: q
        })
        .limit(20);
      if (!error) {
        return Response.json(specialists, { status: 200 });
      } else {
        const { message, status } = errorMessages.specialistQueryFailed;
        return Response.json(message, { status });
      }
    } else {
      const { data: specialists } = await supabase
        .from('tb_users')
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
        .eq('cadre_id', QCOPMId)
        .limit(20);

      let formattedData = null;

      if (specialists) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formattedData = specialists.map((e: any) => {
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
