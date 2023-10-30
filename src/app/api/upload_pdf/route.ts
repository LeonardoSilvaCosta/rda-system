import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import errorMessages from '@/config/errorMessages';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const cpf = searchParams.get('cpf');
  const appointmentId = searchParams.get('appointmentId');

  const formData = await req.formData();
  const pdfFile = formData.get('pdfFile');

  if (!pdfFile)
    return Response.json('Nenhum arquivo encontrado para upload!', {
      status: 400
    });
  try {
    const { error } = await supabase.storage
      .from('records')
      .upload(`${cpf}/record-${appointmentId}.pdf`, pdfFile, {
        contentType: 'application/pdf'
      });

    if (!error) {
      return Response.json('Upload realizado com sucesso!', { status: 200 });
    } else {
      const { message, status } = errorMessages.pdfUploadFailed;
      return Response.json(message, { status });
    }
  } catch (error) {
    return Response.json(`Upload error: ${error}`, { status: 400 });
  }
}
