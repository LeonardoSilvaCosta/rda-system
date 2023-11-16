import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { Database } from '@/types/supabase';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { searchParams } = new URL(req.url);
  const attendedId = searchParams.get('attendedId');

  try {
    if (attendedId) {
      const { data: attendedFiles } = await supabase
        .from('tb_attended_files')
        .select(
          'id, filename, original_name, attended_id, appointment_id, registered_by, url, type, path, bucket_name, created_at'
        )
        .eq('attended_id', attendedId)
        .limit(10);
      const formattedData = attendedFiles?.map((e) => {
        return {
          id: e.id,
          filename: e.filename,
          originalName: e.original_name,
          attendedId: e.attended_id,
          appointmentId: e.appointment_id,
          registeredBy: e.registered_by,
          url: e.url,
          type: e.type,
          path: e.path,
          bucketName: e.bucket_name,
          createdAt: e.created_at
        };
      });
      return Response.json(formattedData);
    } else {
      return Response.json([]);
    }
  } catch (error) {
    return Response.json(`select data error: ${error}`, { status: 400 });
  }
}
