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
      const { data: workStatus } = await supabase
        .from('tb_work_status')
        .select()
        .ilike('name', `%${q}%`)
        .limit(10);
      return Response.json(workStatus);
    } else {
      const { data: workStatus } = await supabase
        .from('tb_work_status')
        .select()
        .limit(10);
      return Response.json(workStatus);
    }
  } catch (error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }
}
