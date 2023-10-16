import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: referral_types } = await supabase
      .from('tb_referral_types')
      .select()
      .limit(10);

    return Response.json(referral_types);
  } catch (error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }
}
