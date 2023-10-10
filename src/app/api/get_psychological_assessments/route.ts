import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: psychological_assessments } = await supabase
    .from('tb_psychological_assessments')
    .select();

    return Response.json(psychological_assessments);

  } catch(error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }

}