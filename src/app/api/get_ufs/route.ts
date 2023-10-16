import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  try {
    if (q) {
      const { data } = await supabase
        .from('tb_states')
        .select(`id, acronym`)
        .ilike('acronym', `%${q}%`)
        .limit(10);

      let formmatedStates = null;

      if (data) {
        formmatedStates = data.map((e) => {
          return {
            id: e.id,
            name: e.acronym
          };
        });
      }

      return Response.json(formmatedStates);
    } else {
      const { data } = await supabase
        .from('tb_states')
        .select(
          `
      id, 
      acronym`
        )
        .limit(10);

      let formmatedStates = null;

      if (data) {
        formmatedStates = data.map((e) => {
          return {
            id: e.id,
            name: e.acronym
          };
        });
      }

      return Response.json(formmatedStates);
    }
  } catch (error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }
}
