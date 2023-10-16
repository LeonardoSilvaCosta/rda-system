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
      const { data: maritalStatus } = await supabase
        .from('tb_marital_status')
        .select()
        .ilike('name', `%${q}%`)
        .limit(10);
      return Response.json(maritalStatus);
    } else {
      const { data: maritalStatus } = await supabase
        .from('tb_marital_status')
        .select()
        .limit(10);
      return Response.json(maritalStatus);
    }
  } catch (error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }
}
