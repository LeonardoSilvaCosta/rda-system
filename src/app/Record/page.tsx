import Image from 'next/image';

import styles from './styles.module.scss';

import { ProfileCard } from '@/components/ProfileCard';
import { Address } from '@/types/types';

type Attended = {
  headerData: HeaderData;
  generalData: GeneralData;
  addressData: Address;
  contactsData: KeyValue[];
};

type HeaderData = {
  avatar: string;
  fullname: string;
};

type GeneralData = {
  birthDate: KeyValue;
  age: KeyValue;
  cpf: KeyValue;
  maritalStatus: KeyValue;
  rg: KeyValue;
  nickname: KeyValue;
  rank: KeyValue;
  cadre: KeyValue;
  workStatus: KeyValue;
  opm: KeyValue;
  gender: KeyValue;
};

export type AddressData = {
  zipCode: KeyValue;
  street: KeyValue;
  neighborhood: KeyValue;
  number: KeyValue;
  complement: KeyValue;
  city_state: KeyValue;
};

type KeyValue = {
  key: string;
  value: string;
};

export default async function Record() {
  const res = await fetch(`${process.env.BASE_URL}/api/get_attended_profile`, {
    cache: 'no-cache'
  });
  const attended: Attended = await res.json();

  const generalData = [
    ...Object.entries(attended.generalData).map(([key, value]) => ({
      key: value.key,
      value: value.value
    }))
  ];

  const addressData = [
    ...Object.entries(attended.addressData).map(([key, value]) => ({
      key: value.key,
      value: value.value
    }))
  ];

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div>
          <Image src="/profile.png" alt="Avatar" width={100} height={100} />
          <span>Leonardo da Silva Costa</span>
        </div>
        <button type="button">Atendimentos</button>
      </header>
      <div className={styles.cards}>
        <ProfileCard
          title={'Dados gerais'}
          keyValues={generalData}
          numberToSlice={6}
        />
        <ProfileCard
          title={'Endereço'}
          keyValues={addressData}
          numberToSlice={3}
        />
        <ProfileCard
          title={'Contatos'}
          keyValues={attended.contactsData}
          numberToSlice={3}
        />
        <ProfileCard
          title={'Vínculos cadastrados'}
          keyValues={addressData}
          numberToSlice={3}
        />
      </div>
    </main>
  );
}
