import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { ImFileEmpty } from 'react-icons/im';

import { AppointmentDetails } from '../AppointmentDetails';
import { LoadingComponent } from '../Loading/loading';
import styles from './styles.module.scss';

import { RecordAppointmentCard } from '@/components/RecordAppointmentCard';
import { Appointment, Attended } from '@/types/types';

interface AppointmentsSummaryProps {
  attended: Attended;
  currentScreen: number;
  setCurrentScreen: Dispatch<SetStateAction<number>>;
}

export function AppointmentsSummary({
  attended,
  currentScreen,
  setCurrentScreen
}: AppointmentsSummaryProps) {
  const [cardSelectedId, setCardSelectedId] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredData, setFilteredData] = useState<Appointment[]>(appointments);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const handleClick = (selectedCardId: string) => {
    setCardSelectedId(selectedCardId);
    setCurrentScreen(2);
  };

  useEffect(() => {
    const getAppointments = async () => {
      try {
        const appointmentsRes = await fetch(
          `/api/get_attended_appointments?cpf=${attended.cpf}`
        );
        const appointmentData = await appointmentsRes.json();

        setAppointments(appointmentData);
        setFilteredData(appointmentData);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    };

    getAppointments();
  }, [appointments, attended.cpf]);

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
      {isLoading ? (
        <LoadingComponent />
      ) : (
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
              {appointments.length > 0 ? (
                <div className={styles.cards}>
                  <RecordAppointmentCard
                    appointments={filteredData}
                    handleClick={handleClick}
                  />
                </div>
              ) : (
                <div className={styles.noContent}>
                  <ImFileEmpty className={styles.emptyPaperIcon} />
                  <p>
                    {`Ainda não há registros de atendimento no prontuário de ${attended.fullname}`}
                  </p>
                </div>
              )}
            </>
          ) : (
            <AppointmentDetails
              attended={attended}
              appointment={appointments.find((e) => e.id === cardSelectedId)}
            />
          )}
        </main>
      )}
    </>
  );
}
