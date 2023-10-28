import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

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
  rank: string | null;
  cadre: string | null;
  opm: string | null;
  gender: string;
  marital_status: string;
  work_status: string | null;
  address: {
    zip_code: string;
    number: string;
    street: string;
    complement: string | null;
    neighborhood: string;
  };
  phones: {
    phone: string;
    owner_identification: string;
    attended_relationship: string | null;
  }[];
  policy_holder: {
    rank: string | null;
    cadre: string | null;
    rg: string | null;
    nickname: string | null;
  };
  dependents: {
    id: string | null;
    cpf: string | null;
    fullname: string | null;
    familiar_bond: string | null;
  }[];
};

//CRIAR versão dessa mesma consulta para função com query

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const cpf = searchParams.get('cpf');

  if (!cpf) return;

  try {
    const { data: attended } = await supabase
      .rpc('get_attended_profile', {
        cpf_input: cpf
      })
      .returns<Attended[]>()
      .limit(1)
      .single();

    if (!attended) return;
    const formattedData = {
      id: attended.id,
      fullname: attended.fullname,
      nickname: attended.nickname,
      rg: attended.rg,
      cpf: attended.cpf,
      birthDate: attended.birth_date,
      avatar: attended.avatar,
      isCivilVolunteer: attended.is_civil_volunteer,
      rank: attended.rank,
      cadre: attended.cadre,
      opm: attended.opm,
      gender: attended.gender,
      maritalStatus: attended.marital_status,
      workStatus: attended.work_status,
      address: {
        zipCode: attended.address.zip_code,
        number: attended.address.number,
        street: attended.address.street,
        complement: attended.address.complement,
        neighborhood: attended.address.neighborhood
      },
      phones: attended.phones.map((e) => {
        return {
          phone: e.phone,
          ownerIdentification: e.owner_identification,
          attendedRelationship: e.attended_relationship
        };
      }),
      policyHolder: attended.policy_holder,
      dependents: attended.dependents
        ? attended.dependents.map((e) => {
            return {
              id: e.id,
              fullname: e.fullname,
              cpf: e.cpf,
              familiarBond: e.familiar_bond
            };
          })
        : []
    };

    return Response.json(formattedData);
  } catch (error) {
    return new NextResponse(`select data error: ${error}`, { status: 400 });
  }
}
