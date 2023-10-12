import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: familiarBonds } = await supabase
    .from('tb_familiar_bonds')
    .select()
    .limit(10);

    return Response.json(familiarBonds);

  } catch(error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }

}