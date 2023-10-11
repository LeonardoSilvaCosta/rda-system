import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: referral_destinations } = await supabase
    .from('tb_referral_destinations')
    .select();

    return Response.json(referral_destinations);

  } catch(error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }

}