import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data } = await supabase.from('tb_states').select(`
    id, 
    acronym`
    )

    let formmatedStates = null;

    if (data) {
      formmatedStates = data.map((e) => {
        return {
          id: e.id,
          name: e.acronym,
        }
      })
    }


    return Response.json(formmatedStates);

  } catch (error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }

}