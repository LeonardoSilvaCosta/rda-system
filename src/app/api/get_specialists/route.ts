import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const QCOPMId = 'df4281a9-d27f-42b8-baf9-fcf9d58d055e';

  try {
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
      .limit(10);

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
  } catch (error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }
}
