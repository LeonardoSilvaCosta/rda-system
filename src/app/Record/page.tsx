'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import styles from './styles.module.scss';

import { AppointmentsSummary } from '@/components/AppointmentsSummary';
import { Header } from '@/components/Header';
import { LoadingComponent } from '@/components/Loading/loading';
import { Profile } from '@/components/Profile';
import { RecordHeader } from '@/components/RecordHeader';
import { Sidebar } from '@/components/Sidebar';
import { Attended } from '@/types/types';

export default function Record() {
  const searchParams = useSearchParams();
  const cpf = searchParams.get('cpf');
  const [attended, setAttended] = useState<Attended>({
    id: '',
    fullname: '',
    nickname: '',
    rg: '',
    cpf: '',
    birthDate: '',
    avatar: '',
    isCivilVolunteer: false,
    rank: '',
    cadre: '',
    opm: '',
    gender: '',
    maritalStatus: '',
    workStatus: '',
    familiarBond: '',
    address: {
      zipCode: '',
      number: '',
      street: '',
      complement: '',
      neighborhood: '',
      city: '',
      city_id: '',
      state_id: '',
      stateAcronym: ''
    },
    phones: [],
    policyHolder: {
      rank: '',
      cadre: '',
      rg: '',
      nickname: '',
      cpf: ''
    },
    dependents: []
  });
  const [currentScreen, setCurrentScreen] = useState(0);
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
  }, [cpf, attended]);

  const handleClick = async () => {
    switch (currentScreen) {
      case 1:
        setCurrentScreen(0);
        break;
      default:
        setCurrentScreen(1);
        break;
    }
  };

  return (
    <main className={styles.wrapper}>
      <Sidebar />
      <div className={styles.main}>
        <Header title={isLoading ? 'Carregando...' : 'Prontuário'} />
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <div className={styles.container}>
            <RecordHeader
              avatar={attended.avatar}
              fullname={attended.fullname}
              buttonTitle={
                currentScreen !== 1 ? 'Atendimentos' : 'Voltar ao perfil'
              }
              handleClick={handleClick}
            />
            {currentScreen === 0 ? (
              <Profile attended={attended} />
            ) : (
              <AppointmentsSummary
                attended={attended}
                currentScreen={currentScreen}
                setCurrentScreen={setCurrentScreen}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
