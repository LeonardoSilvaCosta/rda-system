import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { getCurrentUser } from '@/utils/getCurrentUser';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const attendedId = searchParams.get('attendedId');
  const appointmentId = searchParams.get('appointmentId');
  const filename = searchParams.get('filename');

  const formData = await req.formData();
  const pdfFile = formData.get('pdfFile');

  const recordProgressSpecie = 'cedb92d7-63c4-4c88-a29d-53aa17a26a87';

  if (!pdfFile)
    return Response.json('Nenhum arquivo encontrado para upload!', {
      status: 400
    });
  try {
    const currentUser = await getCurrentUser(supabase);

    const uuid = uuidv4();

    const bucketName = 'attendeds';
    const filenameForBucket = `${uuid}.pdf`;
    const filePath = `${attendedId}/progress-records/${filenameForBucket}`;
    const url = `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${bucketName}/${filePath}`;
    const { error: storageError } = await supabase.storage
      .from(bucketName)
      .upload(`${filePath}`, pdfFile, {
        contentType: 'application/pdf'
      });

    const attendedFile = {
      bucket_name: bucketName,
      filename: filenameForBucket,
      original_name: filename,
      attended_id: String(attendedId),
      appointment_id: appointmentId,
      url,
      specie_id: recordProgressSpecie,
      path: filePath,
      registered_by: await currentUser.id
    };

    const { error: fileInfoError } = await supabase
      .from('tb_attended_files')
      .insert(attendedFile)
      .select();

    if (!storageError && !fileInfoError) {
      return Response.json('Upload realizado com sucesso!', { status: 200 });
    } else {
      // const { message, status } = errorMessages.pdfUploadFailed;
      return Response.json(storageError?.message, { status: 400 });
    }
  } catch (error) {
    return Response.json(`Upload error: ${error}`, { status: 400 });
  }
}
