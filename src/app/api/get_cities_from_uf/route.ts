import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const ufId = searchParams.get('ufId');

  try {
    const { data } = await supabase
      .from('tb_cities')
      .select(
        `
    id, 
    name,
    state_id
    `
      )
      .eq('state_id', ufId);
    return Response.json(data);
  } catch (error) {
    return Response.json(`select data error: ${error}`, { status: 400 });
  }
}
