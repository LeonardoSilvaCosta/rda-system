import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: workStatus } = await supabase
    .from('tb_work_status')
    .select();

    console.log(workStatus)

    return Response.json(workStatus);

  } catch(error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }

}