import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: services } = await supabase
    .from('tb_services')
    .select()
    .limit(10);

    return Response.json(services);

  } catch(error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }

}