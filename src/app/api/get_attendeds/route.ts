import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: attendeds } = await supabase.from('tb_attendeds').select(`
    id, 
    fullname,
    nickname,
    rg,
    cpf,
    tb_ranks ( name ),
    tb_cadres ( name )
    `)

    let formattedData = null;

    if (attendeds) {
      formattedData = attendeds.map((e: any) => {
        return {
          id: e.id,
          fullname: e.fullname,
          nickname: e.nickname ? e.nickname : null,
          rg: e.rg ? e.rg : null,
          rank: e.tb_ranks ? e.tb_ranks.name : null,
          cadre: e.tb_cadres ? e.tb_cadres.name : null,
          cpf: e.cpf,
        }
      })
    }

    return Response.json(formattedData);

  } catch (error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }

}