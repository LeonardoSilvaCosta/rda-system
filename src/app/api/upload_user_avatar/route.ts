import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import errorMessages from '@/config/errorMessages';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const cpf = searchParams.get('cpf');
  const filename = searchParams.get('filename');

  const formData = await req.formData();
  const avatarFile = formData.get('avatar');

  if (!avatarFile)
    return Response.json('Nenhum arquivo encontrado para upload!', {
      status: 400
    });
  try {
    const fileExt = String(filename).split('.').pop();
    const uuid = uuidv4();
    const filePath = `${uuid}.${fileExt}`;
    const avatarUri = `avatars/${cpf}`;
    const avatarPath = `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/users/${avatarUri}/${filePath}`;

    const { error } = await supabase.storage
      .from('users')
      .upload(`${avatarUri}/${filePath}`, avatarFile, {
        contentType: 'image/*'
      });

    if (!error) {
      return Response.json(avatarPath, { status: 200 });
    } else {
      const { message, status } = errorMessages.pdfUploadFailed;
      return Response.json(message, { status });
    }
  } catch (error) {
    return Response.json(`Upload error: ${error}`, { status: 400 });
  }
}
