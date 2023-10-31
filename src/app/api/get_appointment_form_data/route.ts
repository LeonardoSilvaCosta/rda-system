import { cookies } from 'next/headers';

import errorMessages from '@/config/errorMessages';
import { PopulateFormData } from '@/types/types';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: appointmentFormData, error } = await supabase
      .from('appointmentformdata')
      .select()
      .returns<PopulateFormData[]>();

    if (!error) {
      return Response.json(appointmentFormData, { status: 200 });
    } else {
      const { message, status } = errorMessages.appointmentClientDataFailed;
      return Response.json(message, { status });
    }
  } catch (error) {
    return Response.json(`select data error: ${error}`, { status: 400 });
  }
}
