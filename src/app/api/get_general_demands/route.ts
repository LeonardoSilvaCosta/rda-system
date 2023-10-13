import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  try {
    if (q) {
      const { data: general_demands } = await supabase
        .from('tb_general_demands')
        .select()
        .ilike('name', `%${q}%`)
        .limit(10);
      return Response.json(general_demands);
    } else {
      const { data: general_demands } = await supabase
        .from('tb_general_demands')
        .select()
        .limit(10);
      return Response.json(general_demands);
    }

  } catch(error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }

}