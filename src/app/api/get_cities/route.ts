import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { parseArgs } from "util";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data } = await supabase.from('tb_states').select(`
    id, 
    name,
    acronym,
    tb_cities ( id, name, state_id )`)

    let cities = null;

    if (data) {
      cities = data.flatMap(item => {
        return item.tb_cities.map(city => ({
          id: city.id,
          name: city.name,
          state_name: item.name,
          state_acronym: item.acronym,
        }));
      });
    }

    return Response.json(cities);

  } catch (error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }

}