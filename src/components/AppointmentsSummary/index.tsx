import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { ImFileEmpty } from 'react-icons/im';

import { AppointmentDetails } from '../AppointmentDetails';
import { LoadingComponent } from '../Loading/loading';
import { PaginationComponent } from '../PaginationComponent';
import styles from './styles.module.scss';

import { RecordAppointmentCard } from '@/components/RecordAppointmentCard';
import { Appointment, Attended } from '@/types/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
  const [page, setPage] = useState(1);
  const [totalCountOfRegisters, setTotalCountOfRegisters] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const handleClick = (selectedCardId: string) => {
    setCardSelectedId(selectedCardId);
    setCurrentScreen(2);
  };

  useEffect(() => {
    async function getCount() {
      const supabase = createClientComponentClient();

      const { data: count } = await supabase.rpc(
        'get_attended_appointments_count',
        {
          cpf_input: attended.cpf
        }
      );
      setTotalCountOfRegisters(Number(count));
    }

    getCount();
  }, [attended.cpf]);

  useEffect(() => {
    const getAppointments = async () => {
      setIsLoading(true);
      try {
        const appointmentsRes = await fetch(
          `/api/get_attended_appointments?cpf=${attended.cpf}&page=${page}`
        );
        const appointmentData = await appointmentsRes.json();

        setAppointments(appointmentData);
        setFilteredData(appointmentData);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro na solicitação:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getAppointments();
  }, [attended.cpf, page]);

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
            <div>
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
            </div>
          ) : (
            <AppointmentDetails
              attended={attended}
              appointment={appointments.find((e) => e.id === cardSelectedId)}
            />
          )}
          <PaginationComponent
            totalCountOfRegisters={totalCountOfRegisters}
            currentPage={page}
            onPageChange={setPage}
          />
        </main>
      )}
    </>
  );
}
