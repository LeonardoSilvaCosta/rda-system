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
    tb_ranks ( name ),
    tb_cadres ( name )
    `)
      .neq('rg', null)

    let formattedData = null;

    if (attendeds) {
      formattedData = attendeds.map((e: any) => {
        return {
          id: e.id,
          fullname: e.fullname,
          nickname: e.nickname,
          rg: e.rg,
          rank: e.tb_ranks.name,
          cadre: e.tb_cadres.name
        }
      })
    }

    return Response.json(formattedData);

  } catch (error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }

}