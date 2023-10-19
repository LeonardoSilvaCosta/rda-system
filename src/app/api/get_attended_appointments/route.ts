import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { Database } from '@/types/supabase';
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
  tb_accesses: { name: string } | null;
  tb_opms: { name: string } | null;
  tb_modalities: { name: string } | null;
  tb_services: { name: string } | null;
  tb_psychological_assessments: { name: string } | null;
  tb_social_assessments: { name: string } | null;
  tb_general_demands: { name: string } | null;
  tb_procedures: { name: string } | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tb_users: any;
  tb_attendeds: { fullname: string }[];
  tb_specific_demands: { name: string }[];
  tb_documents: { name: string }[];
  tb_travels: { name: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tb_appointment_referrals: { destination: any; type: any }[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  // const { searchParams } = new URL(req.url);
  // const cpf = searchParams.get('cpf');

  try {
    const { data: appointments } = await supabase
      .from('tb_appointments')
      .select(
        `
      id, 
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
      tb_attendeds ( fullname ),
      tb_specific_demands ( name ),
      tb_documents ( name ),
      tb_travels ( name ),
      tb_appointment_referrals (destination (name), type (name))
      `
      )
      // .eq('', cpf)
      .limit(10);

    console.log(JSON.stringify(appointments, null, 2));

    if (!appointments) return;

    // appointments.map(e => e.tb_appointment_referrals.map(e => e.))

    const formattedData = appointments.map((e: Appointment) => {
      return {
        date: {
          key: 'Realizado em',
          value: `${formatDate(e.date)} às ${formatHour(e.time)}`
        },
        specialist: {
          key: 'Realizado por',
          value: e.tb_users
            ? `${e.tb_users.rank_id.name} ${e.tb_users.nickname}`
            : ''
        },
        facility: {
          key: 'Local',
          value: e.tb_opms ? e.tb_opms.name : ''
        },
        recordProgress: {
          key: 'Evolução',
          value: e.record_progress
        },
        service: {
          key: 'Serviço',
          value: e.tb_services ? e.tb_services.name : ''
        },
        procedure: {
          key: 'Procedimento',
          value: e.tb_procedures ? e.tb_procedures.name : ''
        },
        protocol: {
          key: 'Protocolo',
          value: e.protocol ? e.protocol : ''
        },
        time: {
          key: 'Hora',
          value: e.time ? formatHour(e.time) : ''
        },
        hasLeaveOfAbsence: {
          key: 'Houve afastamento?',
          value: e.has_leave_of_absence
        },
        access: {
          key: 'Acesso',
          value: e.tb_accesses ? e.tb_accesses.name : ''
        },
        modality: {
          key: 'Modalidade',
          value: e.tb_modalities ? e.tb_modalities.name : ''
        },
        psychologicalAssessment: {
          key: 'Tipo de avaliação psicológica',
          value: e.tb_psychological_assessments
            ? e.tb_psychological_assessments
            : ''
        },
        socialAssessment: {
          key: 'Tipo de avaliação social',
          value: e.tb_social_assessments ? e.tb_social_assessments.name : ''
        },
        generalDemand: {
          key: 'Demanda geral',
          value: e.tb_general_demands ? e.tb_general_demands.name : ''
        },
        attendeds: {
          key: 'Atendidos',
          value: e.tb_attendeds
        },
        specificDemands: {
          key: 'Demandas específicas',
          value: e.tb_specific_demands
        },
        documents: {
          key: 'Documentos produzidos',
          value: e.tb_documents
        },
        travels: {
          key: 'Deslocamentos',
          value: e.tb_travels
        },
        referrals: {
          key: 'Encaminhamentos',
          value: e.tb_appointment_referrals
        }
      };
    });

    if (!appointments) return;

    // console.log(JSON.stringify(appointments, null, 2));

    return Response.json(formattedData);
  } catch (error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }
}
