import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const cpf = searchParams.get('cpf');
  const appointmentId = searchParams.get('appointmentId');

  const formData = await req.formData();
  const pdfFile = formData.get('pdfFile');

  if (!pdfFile)
    return Response.json('Nenhum arquivo encontrado!', { status: 400 });
  try {
    const { data: pdf, error } = await supabase.storage
      .from('records')
      .upload(`${cpf}/record-${appointmentId}.pdf`, pdfFile);

    if (pdf) {
      return Response.json('Upload realizado com sucesso!', { status: 200 });
    } else {
      return Response.json(`Upload error: ${error}`, { status: 400 });
    }
  } catch (error) {
    return Response.json(`Upload error: ${error}`, { status: 400 });
  }
}
