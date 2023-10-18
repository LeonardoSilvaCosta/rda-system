'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import styles from './styles.module.scss';

import Loading from '@/app/RegisterClient/loading';
import { Header } from '@/components/Header';
import { RecordAppointmentCard } from '@/components/RecordAppointmentCard';
import { RecordHeader } from '@/components/RecordHeader';

type Appointment = {
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

export default function Appointments() {
  const searchParams = useSearchParams();
  const cpf = searchParams.get('cpf');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function requests() {
      try {
        const appointmentsRes = await fetch(`/api/get_attended_appointments`);
        const appointmentData = await appointmentsRes.json();
        setAppointments(appointmentData);

        setIsLoading(false);
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    }

    requests();
  }, [cpf]);

  const keyValueArray = appointments.flatMap((appointment) => {
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
              fullname={'LEONARDO DA SILVA COSTA'}
              buttonTitle="Voltar ao perfil"
              avatar="/profile.png"
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
