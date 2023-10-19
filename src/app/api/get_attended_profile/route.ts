import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { Database } from '@/types/supabase';
import { calculateAge } from '@/utils/calculateAge';
import { formatDate } from '@/utils/formatDateTime';
import { formatPhoneNumber } from '@/utils/formatPhoneNumber';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

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
      tb_ranks ( name ),
      tb_cadres ( name ),
      tb_opms ( name ),
      tb_genders ( name ),
      tb_marital_status ( name ),
      tb_work_status ( name ),
      tb_addresses ( zip_code, number, street, complement, neighborhood ),
      tb_phones ( phone, owner_identification, attended_relationship )     
      `
      )
      .eq('cpf', cpf)
      .limit(1)
      .single();

    if (!attended) return;

    const { data: familiarBonds } = await supabase
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

    if (!familiarBonds) return;

    const formattedFamiliarBonds = familiarBonds.map((e) => {
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
      familiarBondsData: formattedFamiliarBonds
    };

    return Response.json(formattedData);
  } catch (error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }
}
