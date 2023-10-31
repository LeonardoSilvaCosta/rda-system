import { cookies } from 'next/headers';

import errorMessages from '@/config/errorMessages';
import { PopulateFormData } from '@/types/types';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: clientFormData, error } = await supabase
      .from('clientformdata')
      .select()
      .returns<PopulateFormData[]>();

    if (!error) {
      return Response.json(clientFormData, { status: 200 });
    } else {
      const { message, status } = errorMessages.clientFormDataFailed;
      return Response.json(message, { status });
    }
  } catch (error) {
    return Response.json(`select data error: ${error}`, { status: 400 });
  }
}
