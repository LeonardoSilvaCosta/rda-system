import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: general_demands } = await supabase
    .from('tb_general_demands')
    .select()
    .limit(10);

    return Response.json(general_demands);

  } catch(error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }

}