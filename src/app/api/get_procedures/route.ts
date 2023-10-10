import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: procedures } = await supabase
    .from('tb_procedures')
    .select();

    return Response.json(procedures);

  } catch(error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }

}