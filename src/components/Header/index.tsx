// import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ImExit } from 'react-icons/im';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';

import styles from './styles.module.scss';

import { useGlobalContext } from '@/context/globalContext';
import { useRegisterAppointmentContext } from '@/context/registerAppointmentContext';
import { useRegisterClientContext } from '@/context/registerClientContext';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { returnToDashboard } = useGlobalContext();
  const { goToPreviousStep: previousRegisterClientStep } =
    useRegisterClientContext();
  const { goToPreviousStep: previousRegisterAppointmentStep } =
    useRegisterAppointmentContext();
  const [showExitButton, setShowExitButton] = useState(false);

  useEffect(() => {
    if (title === 'Prontuário') {
      setShowExitButton(true);
    } else {
      setShowExitButton(false);
    }
  }, [title]);

  const handleClick = () => {
    switch (title) {
      case 'Prontuário':
        returnToDashboard();
        break;
      case 'Cadastrar atendido':
        previousRegisterClientStep();
        break;
      case 'Registrar atendimento':
        previousRegisterAppointmentStep();
        break;
    }
  };

  return (
    <main
      className={`${styles.wrapper} ${title === 'Home' ? styles.home : ''}`}
    >
      <header className={styles.container}>
        <div className={`${styles.leftColumn}`}>
          <div className={`${styles.leftContent}`}>
            <MdOutlineArrowBackIosNew
              className={`${styles.topArrow} ${
                title === 'Home' ? styles.home : ''
              }`}
              onClick={handleClick}
            />
            <span>{title}</span>
          </div>
        </div>
        <ImExit
          onClick={returnToDashboard}
          className={`${styles.exitIcon} ${showExitButton ? styles.show : ''}`}
        />
      </header>
    </main>
  );
}
