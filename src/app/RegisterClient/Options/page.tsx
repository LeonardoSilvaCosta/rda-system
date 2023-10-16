'use client';
import { useRouter } from 'next/navigation';
import { BsPersonCheck } from 'react-icons/bs';
import { GiPoliceOfficerHead } from 'react-icons/gi';
import { GoPerson } from 'react-icons/go';

import styles from './styles.module.scss';

import { Button } from '@/components/Button';
import { DashboardButton } from '@/components/DashboardButton';
import { Header } from '@/components/Header';

export default function Options() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };

  return (
    <>
      <Header title="Cadastrar atendido" />
      <div className={styles.container}>
        <div className={styles.dashboardButtonContainer}>
          <DashboardButton icon={GiPoliceOfficerHead} name={'Militar'} />
          <DashboardButton icon={BsPersonCheck} name={'Dependente'} />
          <DashboardButton icon={GoPerson} name={'Civil sem vínculo'} />
        </div>
        <div className={styles.buttonContainer}>
          <Button name="Voltar" onClick={handleClick} />
        </div>
      </div>
    </>
  );
}
