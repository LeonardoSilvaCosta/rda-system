import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { formatDate, formatHour } from '@/utils/formatDateTime';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

type Appointment = {
  id: string;
  date: string;
  time: string;
  protocol: string | null;
  has_leave_of_absence: boolean;
  record_progress: string;
  access: string;
  facility: string;
  modality: string;
  service: string;
  psychological_assessment: string | null;
  social_assessment: string | null;
  general_demand: string;
  procedure: string;
  specialists: {
    rank: string | null;
    cadre: string | null;
    rg: string | null;
    nickname: string | null;
    cpf: string;
    fullname: string;
    professional_registration: string;
  }[];
  attendeds: {
    rank: string | null;
    cadre: string | null;
    rg: string | null;
    nickname: string | null;
    cpf: string;
    fullname: string;
  }[];
  specific_demands: [] | null;
  documents: [] | null;
  travels: [] | null;
  referral_destinations: [] | null;
  referral_types: [] | null;
  is_signed: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const cpf = searchParams.get('cpf');
  const q = searchParams.get('q');

  if (!cpf) return;

  const prepareDataToSend = async (appointments: Appointment[]) => {
    const formattedData = appointments.map((e: Appointment) => {
      return {
        id: e.id,
        date: `${formatDate(e.date)} às ${formatHour(e.time)}`,
        time: e.time ? formatHour(e.time) : '',
        protocol: e.protocol ? e.protocol : '',
        hasLeaveOfAbsence: e.has_leave_of_absence,
        recordProgress: e.record_progress,
        access: e.access ? e.access : '',
        facility: e.facility ? e.facility : '',
        modality: e.modality ? e.modality : '',
        service: e.service ? e.service : '',
        psychologicalAssessment: e.psychological_assessment
          ? e.psychological_assessment
          : '',
        socialAssessment: e.social_assessment ? e.social_assessment : '',
        generalDemand: e.general_demand ? e.general_demand : '',
        procedure: e.procedure ? e.procedure : '',
        specialists: e.specialists
          ? e.specialists.map((e) => {
              return {
                rank: e.rank,
                cadre: e.cadre,
                rg: e.rg,
                nickname: e.nickname,
                cpf: e.cpf,
                fullname: e.fullname,
                professionalRegistration: e.professional_registration
              };
            })
          : [],
        attendeds: e.attendeds ? e.attendeds : [],
        specificDemands: e.specific_demands ? e.specific_demands : [],
        documents: e.documents ? e.documents : [],
        travels: e.travels ? e.travels : [],
        referralDestinations: e.referral_destinations
          ? e.referral_destinations
          : [],
        referralTypes: e.referral_types ? e.referral_types : [],
        isSigned: e.is_signed
      };
    });

    return formattedData;
  };

  try {
    if (q) {
      const { data: attendedAppointments } = await supabase
        .rpc('get_attended_appointments_by_query', {
          cpf_input: cpf,
          q_input: q
        })
        .returns<Appointment[]>()
        .limit(10);

      if (!attendedAppointments) return;
      const formattedData = await prepareDataToSend(attendedAppointments);

      return Response.json(formattedData);
    } else {
      const { data: attendedAppointments } = await supabase
        .rpc('get_attended_appointments', {
          cpf_input: cpf
        })
        .returns<Appointment[]>()
        .limit(10);

      if (!attendedAppointments) return;
      const formattedData = await prepareDataToSend(attendedAppointments);
      return Response.json(formattedData);
    }
  } catch (error) {
    return Response.json(`select data error: ${error}`, { status: 400 });
  }
}
