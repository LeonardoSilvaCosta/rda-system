'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import styles from './styles.module.scss';

import { AppointmentsSummary } from '@/components/AppointmentsSummary';
import { Header } from '@/components/Header';
import { LoadingComponent } from '@/components/Loading/loading';
import { Profile } from '@/components/Profile';
import { RecordHeader } from '@/components/RecordHeader';
import { Appointment, Attended } from '@/types/types';
import { convertAttendedToKeyValues } from '@/utils/convertAttendedToKeyValue';

const initialKeyValue = {
  key: '',
  value: ''
};

export default function Record() {
  const searchParams = useSearchParams();
  const cpf = searchParams.get('cpf');
  const [attended, setAttended] = useState<Attended>({
    dependentsData: [],
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
      gender: initialKeyValue,
      isCivilVolunteer: initialKeyValue
    },
    addressData: {
      zipCode: initialKeyValue,
      street: initialKeyValue,
      neighborhood: initialKeyValue,
      number: initialKeyValue,
      complement: initialKeyValue,
      city_state: initialKeyValue
    },
    contactsData: [],
    policyHolder: initialKeyValue
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
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
  }, [cpf]);

  const handleClick = async () => {
    if (appointments.length == 0) {
      try {
        const appointmentsRes = await fetch(
          `/api/get_attended_appointments?cpf=${cpf}`
        );
        const appointmentData = await appointmentsRes.json();

        setAppointments(appointmentData);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    }
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
    <>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <>
          <Header title="Prontuário" />
          <main className={styles.container}>
            <RecordHeader
              avatar={attended.avatar}
              fullname={attended.fullname}
              buttonTitle={
                currentScreen !== 1 ? 'Atendimentos' : 'Voltar ao perfil'
              }
              handleClick={handleClick}
            />
            {currentScreen === 0 ? (
              <Profile attended={convertAttendedToKeyValues(attended)} />
            ) : (
              <AppointmentsSummary
                attended={attended}
                appointments={appointments}
                currentScreen={currentScreen}
                setCurrentScreen={setCurrentScreen}
              />
            )}
          </main>
        </>
      )}
    </>
  );
}
