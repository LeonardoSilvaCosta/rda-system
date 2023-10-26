import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { Database } from '@/types/supabase';
import { formatDate, formatHour } from '@/utils/formatDateTime';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

type AttendedAppointments = {
  id: string;
  fullname: string;
  avatar: string | null;
  tb_appointments: Appointment[];
};

type Appointment = {
  id: string;
  date: string;
  time: string;
  protocol: string | null;
  has_leave_of_absence: boolean;
  record_progress: string;
  tb_accesses: { name: string };
  tb_opms: { name: string };
  tb_modalities: { name: string };
  tb_services: { name: string };
  tb_psychological_assessments: { name: string } | null;
  tb_social_assessments: { name: string } | null;
  tb_general_demands: { name: string };
  tb_procedures: { name: string };
  tb_users: {
    rank: string | null;
    cadre: string | null;
    rg: string | null;
    nickname: string | null;
  };
  tb_attendeds: {
    rank_id: { name: string | null };
    cadre_id: { name: string | null };
    rg: string | null;
    nickname: string | null;
    fullname: string;
    cpf: string | null;
  }[];
  tb_specific_demands: { name: string }[];
  tb_documents: { name: string }[];
  tb_travels: { name: string }[];
  tb_appointment_referrals: {
    destination: { name: string };
    type: { name: string };
  }[];
};

type AppointmentSpecialists = {
  appointment_id: string;
  specialist_id: {
    rank_id: { name: string | null };
    cadre_id: { name: string | null };
    rg: string | null;
    nickname: string | null;
    fullname: string | null;
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { searchParams } = new URL(req.url);
  const cpf = searchParams.get('cpf');

  if (!cpf) return;

  try {
    const { data: attended } = await supabase
      .from('tb_attendeds')
      .select(
        ` id, avatar, fullname, 
      tb_appointments (id, 
      date,
      time,
      protocol,
      has_leave_of_absence,
      record_progress,
      tb_accesses ( name ),
      tb_opms ( name ),
      tb_modalities ( name ),
      tb_services ( name ),
      tb_psychological_assessments ( name ),
      tb_social_assessments ( name ),
      tb_general_demands ( name ),
      tb_procedures( name ),
      tb_users ( rank_id (name), nickname ),
      tb_attendeds ( rank_id (name), cadre_id (name), rg, nickname, fullname, cpf  ),
      tb_specific_demands ( name ),
      tb_documents ( name ),
      tb_travels ( name ),
      tb_appointment_referrals (destination (name), type (name))
      )
      `
      )
      .eq('cpf', cpf)
      .returns<AttendedAppointments[]>()
      .limit(1)
      .single();

    if (!attended) return;

    const { data: specialists } = await supabase
      .from('tb_appointments_specialists')
      .select(
        `
        appointment_id,
        specialist_id (rank_id (name), cadre_id (name), rg, nickname, fullname)
      `
      )
      .in(
        'appointment_id',
        attended.tb_appointments.map((e) => e.id)
      )
      .returns<AppointmentSpecialists[]>();

    const getReferrals = attended?.tb_appointments
      ? attended?.tb_appointments.flatMap((e) =>
          e.tb_appointment_referrals.map(
            (e) =>
              e.destination &&
              '(' + e.destination.name + ' - ' + e.type.name + ')'
          )
        )
      : [];

    if (!specialists) return;

    const formattedSpecialists = specialists.map(
      (e: AppointmentSpecialists) => {
        return {
          appointment_id: e.appointment_id,
          fullname: e.specialist_id.fullname,
          identification: `${e.specialist_id.rank_id.name} ${e.specialist_id.cadre_id.name} ${e.specialist_id.rg} ${e.specialist_id.nickname}`
        };
      }
    );

    const formattedData = attended.tb_appointments.map((e: Appointment) => {
      return {
        id: e.id,
        date: `${formatDate(e.date)} às ${formatHour(e.time)}`,
        time: e.time ? formatHour(e.time) : '',
        protocol: e.protocol ? e.protocol : '',
        hasLeaveOfAbsence: e.has_leave_of_absence,
        recordProgress: e.record_progress,
        access: e.tb_accesses ? e.tb_accesses.name : '',
        facility: e.tb_opms ? e.tb_opms.name : '',
        modality: e.tb_modalities ? e.tb_modalities.name : '',
        service: e.tb_services ? e.tb_services.name : '',
        psychologicalAssessment: e.tb_psychological_assessments
          ? e.tb_psychological_assessments
          : '',
        socialAssessment: e.tb_social_assessments
          ? e.tb_social_assessments.name
          : '',
        generalDemand: e.tb_general_demands ? e.tb_general_demands.name : '',
        procedure: e.tb_procedures ? e.tb_procedures.name : '',
        specialists: formattedSpecialists.filter(
          (item) => item.appointment_id === e.id
        ),
        attendeds: e.tb_attendeds
          ? e.tb_attendeds.map((e) =>
              e.rg
                ? `${e.rank_id.name} ${e.cadre_id.name} ${e.rg} ${e.nickname}`
                : `${e.fullname} - ${e.cpf}`
            )
          : [],
        specificDemands: e.tb_specific_demands
          ? e.tb_specific_demands.map((e) => e.name)
          : [],
        documents: e.tb_documents ? e.tb_documents.map((e) => e.name) : [],
        travels: e.tb_travels ? e.tb_travels.map((e) => e.name) : [],
        referrals: getReferrals
      };
    });

    return Response.json(formattedData);
  } catch (error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }
}
