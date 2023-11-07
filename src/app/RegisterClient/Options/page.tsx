'use client';
import { BsPersonCheck } from 'react-icons/bs';
import { GiPoliceOfficerHead } from 'react-icons/gi';
import { GoPerson } from 'react-icons/go';

import styles from './styles.module.scss';

import { DashboardButton } from '@/components/DashboardButton';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';

export default function Options() {
  return (
    <main className={styles.wrapper}>
      <Sidebar />
      <div className={styles.main}>
        <Header title="Home" />
        <div className={styles.container}>
          <div className={styles.dashboardButtonContainer}>
            <DashboardButton icon={GiPoliceOfficerHead} name={'Militar'} />
            <DashboardButton icon={BsPersonCheck} name={'Dependente'} />
            <DashboardButton icon={GoPerson} name={'Civil sem vínculo'} />
          </div>
        </div>
      </div>
    </main>
  );
}
