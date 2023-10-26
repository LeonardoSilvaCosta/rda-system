import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { Database } from '@/types/supabase';
import { calculateAge } from '@/utils/calculateAge';
import { formatDate } from '@/utils/formatDateTime';
import { formatPhoneNumber } from '@/utils/formatPhoneNumber';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

type Attended = {
  id: string;
  fullname: string;
  nickname: string | null;
  rg: string | null;
  cpf: string;
  birth_date: string;
  avatar: string | null;
  is_civil_volunteer: boolean;
  tb_ranks: { name: string | null };
  tb_cadres: { name: string | null };
  tb_opms: { name: string | null };
  tb_genders: { name: string };
  tb_marital_status: { name: string };
  tb_work_status: { name: string | null };
  tb_addresses: {
    zip_code: string;
    number: string;
    street: string;
    complement: string | null;
    neighborhood: string;
  }[];
  tb_phones: {
    phone: string;
    owner_identification: string;
    attended_relationship: { name: string | null };
  }[];
  policy_holder_id: {
    rank_id: { name: string | null };
    cadre_id: { name: string | null };
    rg: string | null;
    nickname: string | null;
  };
  tb_familiar_bonds: { name: string | null };
};

type Phone = {
  phone: string;
  owner_identification: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attended_relationship: any;
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
        `
      id, 
      fullname,
      nickname,
      rg,
      cpf,
      birth_date,
      avatar,
      is_civil_volunteer,
      tb_ranks ( name ),
      tb_cadres ( name ),
      tb_opms ( name ),
      tb_genders ( name ),
      tb_marital_status ( name ),
      tb_work_status ( name ),
      tb_addresses ( zip_code, number, street, complement, neighborhood ),
      tb_phones ( phone, owner_identification, attended_relationship (name) ),
      policy_holder_id (rank_id (name), cadre_id (name), rg, nickname),
      tb_familiar_bonds (name)
      `
      )
      .eq('cpf', cpf)
      .returns<Attended[]>()
      .limit(1)
      .single();

    if (!attended) return;

    const { data: dependents } = await supabase
      .from('tb_attendeds')
      .select(
        `
      id, 
      fullname,
      cpf,
      tb_familiar_bonds ( name )
      `
      )
      .eq('policy_holder_id', attended.id)
      .limit(10);

    if (!dependents) return;

    const formattedDependents = dependents.map((e) => {
      return {
        key: e.cpf,
        value: `${e.fullname} (${e.tb_familiar_bonds?.name})`
      };
    });

    const formattedContacts = attended.tb_phones.map(
      (e: Phone, index: number) => {
        return {
          key: `Telefone ${index + 1}`,
          value: e.attended_relationship
            ? `${formatPhoneNumber(e.phone)} - ${e.owner_identification} (${
                e.attended_relationship.name
              })`
            : `${formatPhoneNumber(e.phone)} (${e.owner_identification})`
        };
      }
    );

    const formattedData = {
      id: attended.id,
      headerData: {
        avatar: attended.avatar,
        fullname: attended.fullname
      },
      generalData: {
        birthDate: {
          key: 'Data de nascimento',
          value: attended.birth_date ? formatDate(attended.birth_date) : ''
        },
        age: {
          key: 'Idade',
          value: attended.birth_date
            ? calculateAge(new Date(attended.birth_date))
            : ''
        },
        cpf: { key: 'CPF', value: attended.cpf },
        maritalStatus: attended.tb_marital_status
          ? { key: 'Estado civil', value: attended.tb_marital_status.name }
          : null,
        gender: attended.tb_genders
          ? { key: 'Sexo', value: attended.tb_genders.name }
          : null,
        isVolunteer: attended.rg
          ? null
          : {
              key: 'É voluntário Civil:',
              value: attended.is_civil_volunteer ? 'Sim' : 'Não'
            },
        rg: attended.rg ? { key: 'RG', value: attended.rg } : null,
        nickname: attended.nickname
          ? { key: 'Nome de guerra', value: attended.nickname }
          : null,
        rank: attended.tb_ranks
          ? { key: 'Posto/graduação', value: attended.tb_ranks.name }
          : null,
        cadre: attended.tb_cadres
          ? { key: 'Quadro', value: attended.tb_cadres.name }
          : null,
        workStatus: attended.tb_work_status
          ? {
              key: 'Condição funcional',
              value: attended.tb_work_status.name
            }
          : null,
        opm: attended.tb_opms
          ? { key: 'OPM', value: attended.tb_opms.name }
          : null
      },
      addressData: {
        zip_code: { key: 'CEP', value: attended.tb_addresses[0].zip_code },
        street: { key: 'Logradouro', value: attended.tb_addresses[0].street },
        complement: {
          key: 'Complemento',
          value: attended.tb_addresses[0].complement
        },
        number: {
          key: 'Número',
          value: attended.tb_addresses[0].number
        },
        neighborhood: {
          key: 'Bairro',
          value: attended.tb_addresses[0].neighborhood
        },
        city_state: {
          key: 'Cidade/Estado',
          value: 'Belém/PA'
        }
      },
      contactsData: formattedContacts,
      dependentsData: formattedDependents,
      policyHolder: attended.policy_holder_id
        ? {
            key: 'Titular',
            value: `${attended.policy_holder_id.rank_id.name} ${attended.policy_holder_id.cadre_id.name} ${attended.policy_holder_id.rg} ${attended.policy_holder_id.nickname} (${attended.tb_familiar_bonds?.name}) `
          }
        : null
    };

    return Response.json(formattedData);
  } catch (error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }
}
