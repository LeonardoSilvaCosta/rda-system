import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const appointmentId = searchParams.get('appointmentId');

  try {
    const { error } = await supabase
      .from('tb_attended_files')
      .select()
      .match({
        appointment_id: appointmentId,
        specie_id: String(process.env.NEXT_PUBLIC_RECORD_PROGRESS_SPECIE_ID)
      });
    if (!error) {
      return Response.json(true, { status: 200 });
    } else {
      return Response.json(false, { status: 400 });
    }
  } catch (error) {
    Response.json(`Download error ${error}`, { status: 400 });
  }
}
