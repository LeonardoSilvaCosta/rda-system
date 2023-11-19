import { NextRequest } from 'next/server';

import { supabase } from '@/config/supabaseAdmin';

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filepath = searchParams.get('filepath');

  if (!filepath)
    return Response.json(
      'Você precisa informar o caminho do arquivo que será deletado do sistema!',
      {
        status: 400
      }
    );
  try {
    const { error: table_error } = await supabase
      .from('tb_attended_files')
      .delete()
      .eq('path', filepath);

    if (table_error) throw new Error(table_error.message);

    const { error: bucket_error } = await supabase.storage
      .from('attendeds')
      .remove([filepath]);

    if (!bucket_error) {
      return Response.json('Arquivo deletado com sucesso!', { status: 200 });
    } else {
      return Response.json(
        `Não foi possível deletar o arquivo: ${bucket_error.message}`,
        {
          status: 400
        }
      );
    }
  } catch (error) {
    return Response.json(`Erro ao delete usuário do sistema: ${error}`, {
      status: 400
    });
  }
}
