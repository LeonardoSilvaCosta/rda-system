import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data } = await supabase.from('tb_states').select(`
    id, 
    name,
    acronym,
    tb_cities ( id, name, state_id )`)

    console.log(data)

    return Response.json(data);

  } catch (error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }

}