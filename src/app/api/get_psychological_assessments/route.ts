import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  try {
    if (q) {
      const { data: psychological_assessments } = await supabase
        .from('tb_psychological_assessments')
        .select()
        .ilike('name', `%${q}%`)
        .limit(10);
      return Response.json(psychological_assessments);
    } else {
      const { data: psychological_assessments } = await supabase
        .from('tb_psychological_assessments')
        .select()
        .limit(10);
      return Response.json(psychological_assessments);
    }
  } catch (error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }
}
