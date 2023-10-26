import { Dispatch, SetStateAction, useState } from 'react';

import { AppointmentDetails } from '../AppointmentDetails';
import styles from './styles.module.scss';

import { RecordAppointmentCard } from '@/components/RecordAppointmentCard';
import { Appointment, AttendedKeyValue } from '@/types/types';

interface AppointmentsSummaryProps {
  attended: AttendedKeyValue;
  appointments: Appointment[];
  currentScreen: number;
  setCurrentScreen: Dispatch<SetStateAction<number>>;
}

export function AppointmentsSummary({
  attended,
  appointments,
  currentScreen,
  setCurrentScreen
}: AppointmentsSummaryProps) {
  const [cardSelectedId, setCardSelectedId] = useState('');
  const handleClick = (selectedCardId: string) => {
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
