import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  try {
    const { data: currentUser } = await supabase.from('tb_users').select(`
    id, 
    fullname,
    nickname,
    rg,
    cpf,
    tb_ranks ( name ),
    tb_cadres ( name ),
    `)
      .eq('email', email)
      .single();

      alert(currentUser)


    // let formattedData = null;

    // if (users) {
    //   formattedData = users.map((e: any) => {
    //     return {
    //       id: e.id,
    //       fullname: e.fullname,
    //       nickname: e.nickname,
    //       rg: e.rg,
    //       rank: e.tb_ranks.name,
    //       cadre: e.tb_cadres.name,
    //       cpf: e.cpf,
    //     }
    //   })
    // }

    return Response.json(currentUser);

  } catch (error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }

}