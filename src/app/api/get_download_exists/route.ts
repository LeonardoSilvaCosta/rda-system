import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const cpf = searchParams.get('cpf');
  const appointmentId = searchParams.get('appointmentId');

  try {
    const { error } = await supabase.storage
      .from('records')
      .download(`${cpf}/record-${appointmentId}.pdf`);

    if (!error) {
      return Response.json(true, { status: 200 });
    } else {
      return Response.json(false, { status: 400 });
    }
  } catch (error) {
    Response.json(`Download error ${error}`, { status: 400 });
  }
}
