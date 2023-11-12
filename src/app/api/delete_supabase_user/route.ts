import { NextRequest } from 'next/server';

import errorMessages from '@/config/errorMessages';
import { supabase } from '@/config/supabaseAdmin';

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');

  if (!user_id)
    return Response.json(
      'Você precisa enviar o id do usuário que deverá ser deletado do sistema!',
      {
        status: 400
      }
    );
  try {
    const { error, data } = await supabase.auth.admin.deleteUser(user_id);
    if (!error) {
      return Response.json(data, { status: 200 });
    } else {
      const { message, status } = errorMessages.createUserFailed;
      return Response.json(`${message} ${error}`, { status });
    }
  } catch (error) {
    return Response.json(`Erro ao delete usuário do sistema: ${error}`, {
      status: 400
    });
  }
}
