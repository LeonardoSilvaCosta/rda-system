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
      const { data: familiarBonds } = await supabase
        .from('tb_familiar_bonds')
        .select('id, name')
        .ilike('name', `%${q}%`)
        .limit(10);
      return Response.json(familiarBonds);
    } else {
      const { data: familiarBonds } = await supabase
        .from('tb_familiar_bonds')
        .select('id, name')
        .limit(10);
      return Response.json(familiarBonds);
    }
  } catch (error) {
    return Response.json(`select data error: ${error}`, { status: 400 });
  }
}
