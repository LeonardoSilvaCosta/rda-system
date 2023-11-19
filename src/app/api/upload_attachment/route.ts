import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { getCurrentUser } from '@/utils/getCurrentUser';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const attendedId = searchParams.get('attendedId');

  const formData = await req.formData();
  const file = formData.get('file');
  const filename = formData.get('filename');
  const documentSpecie = formData.get('documentSpecie');

  if (!file)
    return Response.json('Nenhum arquivo encontrado para upload!', {
      status: 400
    });
  try {
    const currentUser = await getCurrentUser(supabase);

    const uuid = uuidv4();

    const bucketName = 'attendeds';
    const fileExt = String(filename).split('.').pop();
    const filenameForBucket = `${uuid}.${fileExt}`;
    const filePath = `${attendedId}/attachments/${filenameForBucket}`;
    const url = `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${bucketName}/${filePath}`;
    const { error } = await supabase.storage
      .from('attendeds')
      .upload(`${filePath}`, file);

    const attendedFile = {
      bucket_name: bucketName,
      filename: filenameForBucket,
      original_name: filename,
      attended_id: String(attendedId),
      appointment_id: null,
      url,
      specie_id: String(documentSpecie),
      path: filePath,
      registered_by: await currentUser.id
    };

    const { error: fileInfoError } = await supabase
      .from('tb_attended_files')
      .insert(attendedFile)
      .select();

    if (!error && !fileInfoError) {
      return Response.json('Upload realizado com sucesso!', { status: 200 });
    } else {
      return Response.json(error?.message, { status: 400 });
    }
  } catch (error) {
    return Response.json(`Upload error: ${error}`, { status: 400 });
  }
}
