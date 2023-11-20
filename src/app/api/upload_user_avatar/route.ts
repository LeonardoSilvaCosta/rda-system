import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  const formData = await req.formData();
  const avatarFile = formData.get('avatar');
  const filename = formData.get('filename');
  const registeredBy = formData.get('registeredBy');
  const avatarSpecie = '87d1edd2-c91a-4570-b690-a49f87e898f9';

  if (!avatarFile)
    return Response.json('Nenhum arquivo encontrado para upload!', {
      status: 400
    });
  try {
    const fileExt = String(filename).split('.').pop();
    const uuid = uuidv4();

    const bucketName = 'users';
    const filenameForBucket = `${uuid}.${fileExt}`;
    const filePath = `${userId}/avatars/${filenameForBucket}`;
    const url = `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${bucketName}/${filePath}`;

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(`${filePath}`, avatarFile, {
        contentType: 'image/*'
      });

    if (error)
      throw new Error(
        `Não foi possível salvar a imagem. Error: ${error.message}`
      );

    const userFile = {
      bucket_name: bucketName,
      filename: filenameForBucket,
      original_name: filename,
      user_id: String(userId),
      url,
      specie_id: avatarSpecie,
      path: filePath,
      registered_by: registeredBy
    };

    const { error: fileInfoError } = await supabase
      .from('tb_user_files')
      .insert(userFile)
      .select();

    if (!fileInfoError) {
      return Response.json(filePath, { status: 200 });
    } else {
      return Response.json(
        `Não foi possível subir a imagem: ${fileInfoError.message}`,
        { status: 400 }
      );
    }
  } catch (error) {
    return Response.json(`Upload error: ${error}`, { status: 400 });
  }
}
