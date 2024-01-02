import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

type Response = {
  id: string;
  filename: string;
  original_name: string;
  appointment_id: string;
  url: string;
  specie: string;
  path: string;
  bucket_name: string;
  attended_data: {
    id: string;
    fullname: string;
    rank: string;
    cadre: string;
    rg: string;
    nickname: string;
    cpf: string;
  };
  user_data: {
    id: string;
    rank: string;
    cadre: string;
    rg: string;
    nickname: string;
    cpf: string;
  };
  created_at: string;
};

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const attendedId = searchParams.get('attendedId');

  try {
    if (attendedId) {
      const { data: attendedFiles, error } = await supabase.rpc(
        'get_attended_attachments',
        {
          attended_id_input: attendedId
        }
      );
      if (error) console.error(error);

      const formattedData = attendedFiles?.map((e: Response) => {
        return {
          id: e.id,
          filename: e.filename,
          originalName: e.original_name,
          appointmentId: e.appointment_id,
          attended: {
            id: e.attended_data.id,
            fullname: e.attended_data.fullname,
            rank: e.attended_data.rank,
            cadre: e.attended_data.cadre,
            rg: e.attended_data.rg,
            nickname: e.attended_data.nickname,
            cpf: e.attended_data.cpf
          },
          user: {
            id: e.user_data.id,
            rank: e.user_data.rank,
            cadre: e.user_data.cadre,
            rg: e.user_data.rg,
            nickname: e.user_data.nickname,
            cpf: e.user_data.cpf
          },
          url: e.url,
          specie: e.specie,
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
