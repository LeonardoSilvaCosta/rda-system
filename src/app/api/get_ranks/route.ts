import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  try {
    if (q) {
      const { data: ranks } = await supabase
        .from('tb_ranks')
        .select()
        .ilike('name', `%${q}%`)
        .limit(10);
      return Response.json(ranks);
    } else {
      const { data: ranks } = await supabase
        .from('tb_ranks')
        .select()
        .limit(10);
      return Response.json(ranks);
    }
  } catch (error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }

}