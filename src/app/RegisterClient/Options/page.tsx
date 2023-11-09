'use client';
import { useEffect, useState } from 'react';
import { BsPersonCheck } from 'react-icons/bs';
import { GiPoliceOfficerHead } from 'react-icons/gi';
import { GoPerson } from 'react-icons/go';

import styles from './styles.module.scss';

import { DashboardButton } from '@/components/DashboardButton';
import { Header } from '@/components/Header';
import { LoadingComponent } from '@/components/Loading/loading';
import { Sidebar } from '@/components/Sidebar';

export default function Options() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <main className={styles.wrapper}>
      <Sidebar />
      <div className={styles.main}>
        <Header title={isLoading ? 'Carregando...' : ''} />
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <div className={styles.container}>
            <h2>Tipo de atendido a ser cadastrado</h2>
            <div className={styles.dashboardButtonContainer}>
              <DashboardButton icon={GiPoliceOfficerHead} name={'Militar'} />
              <DashboardButton icon={BsPersonCheck} name={'Dependente'} />
              <DashboardButton icon={GoPerson} name={'Civil sem vínculo'} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
