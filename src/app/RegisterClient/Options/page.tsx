"use client"
import { DashboardButton } from '@/components/DashboardButton';
import styles from './styles.module.scss';

import { GiPoliceOfficerHead } from 'react-icons/gi';
import { BsPersonCheck } from 'react-icons/bs';
import { GoPerson } from 'react-icons/go';
import { Header } from '@/components/Header';

export default function Options() {
  return (
    <>
      <Header title="Cadastrar atendido" />
      <div className={styles.container}>
        <div className={styles.dashboardButtonContainer}>
          <DashboardButton icon={GiPoliceOfficerHead} name={"Militar"} />
          <DashboardButton icon={BsPersonCheck} name={"Dependente"} />
          <DashboardButton icon={GoPerson} name={"Civil sem vínculo"} />
        </div>
      </div>
    </>
  )
}