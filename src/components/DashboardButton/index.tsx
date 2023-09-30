"use client"

import { IconType } from 'react-icons';
import styles from './styles.module.scss';
import Link from 'next/link';
import { useRegisterClientContext } from '@/context/registerClientContext';

interface DashboardButtonProps {
  icon: IconType;
  name: string;
}

export function DashboardButton({ icon: Icon, name }: DashboardButtonProps) {
  const { selectFormValidation } = useRegisterClientContext();

  const routeMapping: { [key: string]: string } = {
    'Cadastrar atendido': '/RegisterClient/Options',
    'Registrar atendimento': '/RegisterAppointment',
  };

  const formattedName = name.toLowerCase().replaceAll(' ', '-');

  const selectRoute = () => {
    return routeMapping[name] || `/RegisterClient/Form?type=${formattedName}`;
  };

  const handleClick = () => {
    selectFormValidation(formattedName);
  };

  return (
    <Link onClick={handleClick} href={selectRoute()}>
      <div className={styles.button}>
        <i>
          <Icon className={styles.icon} />
        </i>
        <span>{name}</span>
      </div>
    </Link>
  )
}