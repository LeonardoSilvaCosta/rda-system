'use client';

import Link from 'next/link';
import { IconType } from 'react-icons';

import styles from './styles.module.scss';

import { useRegisterClientContext } from '@/context/registerClientContext';
import { firstClientFormValidations } from '@/validation';

interface DashboardButtonProps {
  icon: IconType;
  name: string;
}

export function DashboardButton({ icon: Icon, name }: DashboardButtonProps) {
  const {
    setCurrentStep,
    setCurrentFormType,
    setIsCPFUnique,
    setIsCPFValid,
    reset
  } = useRegisterClientContext();

  const routeMapping: { [key: string]: string } = {
    'Cadastrar atendido': '/RegisterClient/Options',
    'Registrar atendimento': '/RegisterAppointment'
  };

  const formattedName = name.toLowerCase().replaceAll(' ', '-');

  const handleClick = () => {
    setIsCPFUnique(true);
    setIsCPFValid(true);
    reset();
    setCurrentStep(0);
    const keyFormType =
      formattedName as keyof typeof firstClientFormValidations;
    setCurrentFormType(keyFormType);
  };

  return (
    <Link
      href={routeMapping[name] || `/RegisterClient/Form?type=${formattedName}`}
    >
      <div className={styles.button} onClick={handleClick}>
        <i>
          <Icon className={styles.icon} />
        </i>
        <span>{name}</span>
      </div>
    </Link>
  );
}
