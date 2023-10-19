'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import styles from './styles.module.scss';

import Loading from '@/app/RegisterClient/loading';
import { Header } from '@/components/Header';
import { RecordAppointmentCard } from '@/components/RecordAppointmentCard';
import { RecordHeader } from '@/components/RecordHeader';

type Appointment = {
  headerData: HeaderData;
  generalData: GeneralData[];
};

type HeaderData = {
  id: string;
  avatar: string;
  fullname: string;
};

type GeneralData = {
  date: KeyValue;
  time: KeyValue;
  protocol: KeyValue;
  hasLeaveOfAbsence: KeyValue;
  recordProgress: KeyValue;
  access: KeyValue;
  facility: KeyValue;
  modality: KeyValue;
  service: KeyValue;
  psychologicalAssessment: KeyValue;
  socialAssessment: KeyValue;
  generalDemand: KeyValue;
  procedure: KeyValue;
  specialist: KeyValue;
  attendeds: KeyValue;
  specificDemands: KeyValue;
  documents: KeyValue;
  travels: KeyValue;
  referrals: KeyValue;
};

type KeyValue = {
  key: string;
  value: string;
};

const appointmentInitialValue = {
  headerData: {
    id: '',
    avatar: '',
    fullname: ''
  },
  generalData: []
};

export default function Appointments() {
  const searchParams = useSearchParams();
  const cpf = searchParams.get('cpf');
  const [appointments, setAppointments] = useState<Appointment>(
    appointmentInitialValue
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function requests() {
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

    requests();
  }, [cpf]);

  const keyValueArray = appointments.generalData.flatMap((appointment) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const keyValue = Object.entries(appointment).map(([key, value]) => ({
      key: value.key,
      value: value.value
    }));
    return keyValue;
  });
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Header title="Prontuário" />
          <main className={styles.container}>
            <RecordHeader
              fullname={appointments.headerData.fullname}
              buttonTitle="Voltar ao perfil"
              avatar={appointments.headerData.avatar}
            />
            <div className={styles.cards}>
              <RecordAppointmentCard
                title={''}
                keyValues={keyValueArray}
                numberToSlice={4}
                maxItems={7}
              />
            </div>
          </main>
        </>
      )}
    </>
  );
}
