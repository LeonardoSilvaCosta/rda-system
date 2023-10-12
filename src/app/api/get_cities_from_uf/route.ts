import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const ufId = searchParams.get('ufId');

  try {
    const { data } = await supabase.from('tb_cities').select(`
    id, 
    name,
    state_id
    `)
      .eq("state_id", ufId)
      .limit(10);

    return Response.json(data);

  } catch (error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }

}