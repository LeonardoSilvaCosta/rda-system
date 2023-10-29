import { RefObject, createRef, useEffect, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';

import styles from './styles.module.scss';

import { Appointment } from '@/types/types';

interface RecordAppointmentCardProps {
  appointments: Appointment[];
  handleClick: (selectedCardId: string) => void;
}

export function RecordAppointmentCard({
  appointments,
  handleClick
}: RecordAppointmentCardProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRefs: Record<string, React.RefObject<HTMLDivElement>> = {};

  const closeDropdown = () => {
    setOpenDropdownId(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      for (const id in dropdownRefs) {
        if (
          dropdownRefs[id].current &&
          !dropdownRefs[id].current?.contains(event.target as Node)
        ) {
          closeDropdown();
          break;
        }
      }
    };

    if (openDropdownId) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId]);

  return (
    <>
      {appointments.map((e) => (
        <>
          <main key={e.id} className={`${styles.container}`}>
            <div
              ref={(ref) => {
                if (ref) {
                  const refObject = { current: ref };
                  dropdownRefs[e.id] =
                    refObject as React.RefObject<HTMLDivElement>;
                }
              }}
              className={`${styles.columnswrapper} ${
                openDropdownId === e.id ? styles.visible : ''
              }`}
            >
              <div className={styles.columns}>
                <div className={styles.contentColumn}>
                  <span>{`Realizado em: ${e.date}`}</span>
                  <span>{`Realizado por: ${e.specialists
                    .map((e) => `${e.rank} ${e.cadre} ${e.rg} ${e.nickname}`)
                    .join(', ')}`}</span>
                  <span>{`Local: ${e.facility}`}</span>
                </div>
                <div className={`${styles.contentColumn}`}>
                  <span>{`Serviço: ${e.service}`}</span>
                  <span>{`Procedimento: ${e.procedure}`}</span>
                  <span>{`Protocolo: ${
                    e.protocol ? e.protocol : 'Sem registro'
                  }`}</span>
                </div>
              </div>
              <div className={`${styles.buttonsWrapper}`}>
                <div
                  onClick={() => {
                    if (openDropdownId === e.id) {
                      closeDropdown();
                    } else {
                      setOpenDropdownId(e.id);
                    }
                  }}
                  className={`${styles.chevronButton} ${
                    openDropdownId === e.id ? styles.visible : ''
                  }`}
                >
                  <span>Evolução</span>
                  <BsChevronDown
                    className={`${styles.chevronDown} ${
                      openDropdownId === e.id ? styles.visible : ''
                    }`}
                  />
                </div>
                <button onClick={() => handleClick(e.id)}>Saber mais</button>
              </div>
            </div>
            {openDropdownId === e.id && (
              <div
                className={`${styles.dropdown} ${
                  openDropdownId === e.id ? styles.visible : ''
                }`}
              >
                <span key={e.id}>{`${e.recordProgress}`}</span>
              </div>
            )}
          </main>
        </>
      ))}
    </>
  );
}
