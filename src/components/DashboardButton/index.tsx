"use client"

import { IconType } from 'react-icons';
import styles from './styles.module.scss';
import Link from 'next/link';

interface DashboardButtonProps {
  icon: IconType;
  name: string;
}

export function DashboardButton({ icon: Icon, name }: DashboardButtonProps) {
  const selectRoute = () => {
    if (name === 'Cadastrar atendido') {
      return '/RegisterClient'
    } else {
      return '/RegisterAppointment'
    }
  }

  return (
    <Link href={selectRoute()}>
      <div className={styles.button}>
        <i>
          <Icon className={styles.icon} />
        </i>
        <span>{name}</span>
      </div>
    </Link>
  )
}