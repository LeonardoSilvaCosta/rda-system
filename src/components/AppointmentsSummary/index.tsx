import { Dispatch, SetStateAction, useState } from 'react';

import { AppointmentDetails } from '../AppointmentDetails';
import styles from './styles.module.scss';

import { RecordAppointmentCard } from '@/components/RecordAppointmentCard';
import { AttendedKeyValue } from '@/types/types';

interface AppointmentsSummaryProps {
  attended: AttendedKeyValue;
  appointments: Appointment[];
  currentScreen: number;
  setCurrentScreen: Dispatch<SetStateAction<number>>;
}

type Appointment = {
  id: string;
  date: string;
  time: string;
  protocol: string;
  hasLeaveOfAbsence: string;
  recordProgress: string;
  access: string;
  facility: string;
  modality: string;
  service: string;
  psychologicalAssessment: string;
  socialAssessment: string;
  generalDemand: string;
  procedure: string;
  specialists: [];
  attendeds: [];
  specificDemands: [];
  documents: [];
  travels: [];
  referrals: [];
};

type KeyValue = {
  key: string;
  value: string;
};

export function AppointmentsSummary({
  attended,
  appointments,
  currentScreen,
  setCurrentScreen
}: AppointmentsSummaryProps) {
  const [cardSelectedId, setCardSelectedId] = useState('');
  const handleClick = (selectedCardId: string) => {
    // setIsAppointmentsSummaryPage(!isAppointmentsSummaryPage);
    setCardSelectedId(selectedCardId);
    setCurrentScreen(2);
  };
  return (
    <>
      <main className={styles.container}>
        {currentScreen > 0 && currentScreen === 1 ? (
          <>
            <div className={styles.cards}>
              <RecordAppointmentCard
                appointments={appointments}
                handleClick={handleClick}
              />
            </div>
          </>
        ) : (
          <AppointmentDetails
            attended={attended}
            appointments={appointments.find((e) => e.id === cardSelectedId)}
          />
        )}
      </main>
    </>
  );
}
