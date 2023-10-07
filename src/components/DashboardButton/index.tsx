"use client"

import { IconType } from 'react-icons';
import styles from './styles.module.scss';
import Link from 'next/link';
import { useRegisterClientContext } from '@/context/registerClientContext';
import { firstFormValidations } from '@/validation';

interface DashboardButtonProps {
  icon: IconType;
  name: string;
}

export function DashboardButton({ icon: Icon, name }: DashboardButtonProps) {
  const { setCurrentFormType } = useRegisterClientContext();

  const routeMapping: { [key: string]: string } = {
    'Cadastrar atendido': '/RegisterClient/Options',
    'Registrar atendimento': '/RegisterAppointment',
  };

  const formattedName = name.toLowerCase().replaceAll(' ', '-');

  const handleClick = () => {
    const keyFormType = formattedName as keyof typeof firstFormValidations;
    setCurrentFormType(keyFormType);
  };

  return (
    <Link href={routeMapping[name] || `/RegisterClient/Form?type=${formattedName}`}>
      <div className={styles.button} onClick={handleClick}>
        <i>
          <Icon className={styles.icon} />
        </i>
        <span>{name}</span>
      </div>
    </Link>
  )
}