import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { Database } from '@/types/supabase';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  try {
    if (q) {
      const { data: document_species } = await supabase
        .from('tb_document_species')
        .select('id, name')
        .not('name', 'in', '(Evolução,Termo de anulação,Avatar)')
        .ilike('name', `%${q}%`)
        .limit(10);
      return Response.json(document_species);
    } else {
      const { data: document_species } = await supabase
        .from('tb_document_species')
        .select('id, name')
        .not('name', 'in', '(Evolução,Termo de anulação,Avatar)')
        .limit(10);
      return Response.json(document_species);
    }
  } catch (error) {
    return Response.json(`select data error: ${error}`, { status: 400 });
  }
}
