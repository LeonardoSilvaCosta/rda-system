import { useEffect, useRef, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';

import styles from './styles.module.scss';

interface RecordAppointmentCardProps {
  title: string;
  keyValues: CardValue[];
  numberToSlice: number;
  maxItems: number;
}

type CardValue = {
  key: string;
  value: string;
};

export function RecordAppointmentCard({
  title,
  keyValues,
  numberToSlice,
  maxItems
}: RecordAppointmentCardProps) {
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getColumns = (array: CardValue[], numberToSlice: number) => {
    const noEmptyArray = array.filter((e) => e.value !== '');
    if (array.length > numberToSlice) {
      const firstArray = noEmptyArray.slice(0, numberToSlice);
      const secondArray = noEmptyArray.slice(numberToSlice, maxItems);

      return [firstArray, secondArray];
    } else {
      return [array, []];
    }
  };

  const closeDropdown = () => {
    setIsDropDownVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    if (isDropDownVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropDownVisible]);

  const [firstColumn, secondColumn] = getColumns(keyValues, numberToSlice);

  return (
    <main className={`${styles.container}`}>
      <header>
        <span>{title}</span>
      </header>
      <div
        ref={dropdownRef}
        className={`${styles.columnswrapper} ${
          isDropDownVisible ? styles.visible : ''
        }`}
      >
        <div className={styles.columns}>
          <div className={styles.contentColumn}>
            {firstColumn.map((e) => (
              <>
                {e.key !== 'Evolução' && (
                  <span key={e.key}>
                    {e.key !== 'Evolução' ? `${e.key}: ${e.value}` : `${e.key}`}
                  </span>
                )}
              </>
            ))}
          </div>
          <div className={`${styles.contentColumn}`}>
            {secondColumn.map((e) => (
              <span key={e.key}>
                {e.key ? `${e.key}: ${e.value}` : e.value}
              </span>
            ))}
          </div>
        </div>
        <div className={`${styles.buttonsWrapper}`}>
          <div
            onClick={() => {
              setIsDropDownVisible(!isDropDownVisible);
            }}
            className={`${styles.chevronButton} ${
              isDropDownVisible ? styles.visible : ''
            }`}
          >
            <span>Evolução</span>
            <BsChevronDown
              className={`${styles.chevronDown} ${
                isDropDownVisible ? styles.visible : ''
              }`}
            />
          </div>
          <button>Saber mais</button>
        </div>
      </div>
      {isDropDownVisible && (
        <div
          className={`${styles.dropdown} ${
            isDropDownVisible ? styles.visible : ''
          }`}
        >
          {firstColumn.map((e) => (
            <span key={e.key}>{e.key === 'Evolução' && `${e.value}`}</span>
          ))}
        </div>
      )}
    </main>
  );
}
