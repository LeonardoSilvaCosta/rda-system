"use client"
import { DashboardButton } from '@/components/DashboardButton';
import styles from './styles.module.scss';

import { GiPoliceOfficerHead } from 'react-icons/gi';
import { BsPersonCheck } from 'react-icons/bs';
import { GoPerson } from 'react-icons/go';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';

export default function Options() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/");
  }

  return (
    <>
      <Header title="Cadastrar atendido" />
      <div className={styles.container}>
        <div className={styles.dashboardButtonContainer}>
          <DashboardButton icon={GiPoliceOfficerHead} name={"Militar"} />
          <DashboardButton icon={BsPersonCheck} name={"Dependente"} />
          <DashboardButton icon={GoPerson} name={"Civil sem vínculo"} />
        </div>
        <div className={styles.buttonContainer}>
          <Button name='Voltar' onClick={handleClick} />
        </div>
      </div>
    </>
  )
}