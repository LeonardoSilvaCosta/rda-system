import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import errorMessages from '@/config/errorMessages';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const cpf = searchParams.get('cpf');
  const appointmentId = searchParams.get('appointmentId');

  try {
    const { data, error } = await supabase.storage
      .from('records')
      .download(`${cpf}/record-${appointmentId}.pdf`);

    if (!error) {
      const headers = {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=record-${appointmentId}.pdf`
      };

      return new Response(data, {
        headers,
        status: 200
      });
    } else {
      const { message, status } = errorMessages.pdfDownloadFailed;
      return Response.json(message, { status });
    }
  } catch (error) {
    Response.json(`Download error ${error}`, { status: 400 });
  }
}
