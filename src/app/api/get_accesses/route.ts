import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { Database } from '@/types/supabase';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  try {
    if (q) {
      const { data: accesses } = await supabase
        .from('tb_accesses')
        .select('id, name')
        .ilike('name', `%${q}%`)
        .limit(10);
      return Response.json(accesses);
    } else {
      return Response.json([]);
    }
  } catch (error) {
    return Response.json(`select data error: ${error}`, { status: 400 });
  }
}
