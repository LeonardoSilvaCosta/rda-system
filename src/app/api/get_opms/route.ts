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
      const { data: opms } = await supabase
        .from('tb_opms')
        .select('id, acronym')
        .ilike('acronym', `%${q}%`)
        .limit(10);

      const formattedDate = opms?.map((e) => {
        return {
          id: e.id,
          name: e.acronym
        };
      });
      return Response.json(formattedDate);
    } else {
      return Response.json([]);
    }
  } catch (error) {
    return Response.json(`select data error: ${error}`, { status: 400 });
  }
}
