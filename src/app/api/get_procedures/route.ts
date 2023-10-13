import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  try {
    if (q) {
      const { data: procedures } = await supabase
        .from('tb_procedures')
        .select()
        .ilike('name', `%${q}%`)
        .limit(10);
      return Response.json(procedures);
    } else {
      const { data: procedures } = await supabase
        .from('tb_procedures')
        .select()
        .limit(10);
      return Response.json(procedures);
    }

  } catch(error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }

}