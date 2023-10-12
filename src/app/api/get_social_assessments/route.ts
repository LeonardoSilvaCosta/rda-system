import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: social_assessments } = await supabase
    .from('tb_social_assessments')
    .select()
    .limit(10);

    return Response.json(social_assessments);

  } catch(error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }

}