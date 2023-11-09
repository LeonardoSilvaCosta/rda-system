'use client';

import { useEffect, useState } from 'react';

import styles from './styles.module.scss';

import { Dashboard } from '@/components/Dashboard';
import { Header } from '@/components/Header';
import { LoadingComponent } from '@/components/Loading/loading';
import { Sidebar } from '@/components/Sidebar';
import { useGlobalContext } from '@/context/globalContext';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { showNav } = useGlobalContext();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <main className={`${styles.wrapper} ${showNav ? styles.noScroll : ''}`}>
      <Sidebar />
      <div className={styles.main}>
        <Header title={isLoading ? 'Carregando...' : ''} />
        {isLoading ? <LoadingComponent /> : <Dashboard />}
      </div>
    </main>
  );
}
