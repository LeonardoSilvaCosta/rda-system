import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: travels } = await supabase
    .from('tb_travels')
    .select()
    .limit(10);

    return Response.json(travels);

  } catch(error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }

}