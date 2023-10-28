import { Dispatch, SetStateAction, useState } from 'react';
import { BsSearch } from 'react-icons/bs';

import { AppointmentDetails } from '../AppointmentDetails';
import styles from './styles.module.scss';

import { RecordAppointmentCard } from '@/components/RecordAppointmentCard';
import { Appointment, Attended } from '@/types/types';

interface AppointmentsSummaryProps {
  attended: Attended;
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
  const [filteredData, setFilteredData] = useState<Appointment[]>(appointments);
  const [query, setQuery] = useState('');
  const handleClick = (selectedCardId: string) => {
    setCardSelectedId(selectedCardId);
    setCurrentScreen(2);
  };

  const handleChangeInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    const qToLower = q.toLowerCase();
    setQuery(q);

    if (q !== '') {
      const res = await fetch(
        `/api/get_attended_appointments?cpf=${attended.cpf}&q=${qToLower}`
      );
      const data = await res.json();
      if (!data) return;

      setFilteredData(data);
    } else {
      setFilteredData(appointments);
    }
  };

  return (
    <>
      <main className={styles.container}>
        {currentScreen > 0 && currentScreen === 1 ? (
          <>
            <div className={styles.searchBox}>
              <input
                type="text"
                name="search"
                autoComplete={'off'}
                value={query}
                placeholder={'Pesquisar'}
                onChange={(e) => handleChangeInput(e)}
              />
              <BsSearch className={styles.icon} />
            </div>
            <div className={styles.cards}>
              <RecordAppointmentCard
                appointments={filteredData}
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
