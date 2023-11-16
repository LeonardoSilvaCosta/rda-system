import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const cpf = searchParams.get('cpf');

  const formData = await req.formData();
  const file = formData.get('file');

  if (!file)
    return Response.json('Nenhum arquivo encontrado para upload!', {
      status: 400
    });
  try {
    const { error } = await supabase.storage
      .from('attendeds')
      .upload(`/attachments${cpf}/attachment.pdf`, file);

    if (!error) {
      return Response.json('Upload realizado com sucesso!', { status: 200 });
    } else {
      return Response.json(error.message, { status: 400 });
    }
  } catch (error) {
    return Response.json(`Upload error: ${error}`, { status: 400 });
  }
}
