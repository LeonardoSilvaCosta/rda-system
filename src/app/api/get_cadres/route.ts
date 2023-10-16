import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  try {
    if (q) {
      const { data: cadres } = await supabase
        .from('tb_cadres')
        .select()
        .ilike('name', `%${q}%`)
        .limit(10);
      return Response.json(cadres);
    } else {
      const { data: cadres } = await supabase
        .from('tb_cadres')
        .select()
        .limit(10);
      return Response.json(cadres);
    }
  } catch (error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }
}
