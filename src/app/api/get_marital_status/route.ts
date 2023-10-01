import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: marital_status } = await supabase
    .from('tb_marital_status')
    .select();

    return Response.json(marital_status);

  } catch(error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }

}