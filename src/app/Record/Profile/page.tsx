'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import styles from './styles.module.scss';

import { Header } from '@/components/Header';
import { LoadingComponent } from '@/components/Loading/loading';
import { RecordHeader } from '@/components/RecordHeader';
import { RecordProfileCard } from '@/components/RecordProfileCard';
import { AddressData, GeneralData, HeaderData, KeyValue } from '@/types/types';

type Attended = {
  headerData: HeaderData;
  generalData: GeneralData;
  addressData: AddressData;
  contactsData: KeyValue[];
  familiarBondsData: KeyValue[];
};

const initialKeyValue = {
  key: '',
  value: ''
};

export default function Profile() {
  const searchParams = useSearchParams();
  const cpf = searchParams.get('cpf');
  const [attended, setAttended] = useState<Attended>({
    familiarBondsData: [],
    headerData: { avatar: '', fullname: '' },
    generalData: {
      birthDate: initialKeyValue,
      age: initialKeyValue,
      cpf: initialKeyValue,
      maritalStatus: initialKeyValue,
      rg: initialKeyValue,
      nickname: initialKeyValue,
      rank: initialKeyValue,
      cadre: initialKeyValue,
      workStatus: initialKeyValue,
      opm: initialKeyValue,
      gender: initialKeyValue
    },
    addressData: {
      zipCode: initialKeyValue,
      street: initialKeyValue,
      neighborhood: initialKeyValue,
      number: initialKeyValue,
      complement: initialKeyValue,
      city_state: initialKeyValue
    },
    contactsData: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function requests() {
      try {
        const attendedProfileRes = await fetch(
          `/api/get_attended_profile?cpf=${cpf}`
        );
        const attendedData: Attended = await attendedProfileRes.json();
        setAttended(attendedData);

        setIsLoading(false);
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    }

    requests();
  }, [cpf]);

  const generalData = attended.generalData
    ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(attended.generalData).map(([key, value]) => ({
        key: value.key,
        value: value.value
      }))
    : [];

  const addressData = attended.addressData
    ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(attended.addressData).map(([key, value]) => ({
        key: value.key,
        value: value.value
      }))
    : [];

  return (
    <>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <>
          <Header title="Prontuário" />
          <main className={styles.container}>
            <RecordHeader
              avatar={attended.headerData.avatar}
              fullname={attended.headerData.fullname}
              buttonTitle={'Atendimentos'}
              goToRoute={`/Record/Appointments?cpf=${
                attended.generalData.cpf.value
              }&attended=${JSON.stringify(attended)}`}
            />
            <div className={styles.cards}>
              <RecordProfileCard
                title={'Dados gerais'}
                keyValues={generalData}
                numberToSlice={6}
                maxItems={12}
              />
              <RecordProfileCard
                title={'Endereço'}
                keyValues={addressData}
                numberToSlice={3}
                maxItems={6}
              />
              <RecordProfileCard
                title={'Contatos'}
                keyValues={attended.contactsData}
                numberToSlice={3}
                maxItems={6}
              />
              <RecordProfileCard
                title={'Vínculos cadastrados'}
                keyValues={attended.familiarBondsData}
                numberToSlice={3}
                maxItems={6}
              />
            </div>
          </main>
        </>
      )}
    </>
  );
}
