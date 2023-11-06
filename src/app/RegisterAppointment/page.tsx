'use client';

import styles from './styles.module.scss';

import { Navbar } from '@/components/Navbar';
import { useRegisterAppointmentContext } from '@/context/registerAppointmentContext';

export default function Form() {
  const { currentComponent, handleSubmit, onSubmit } =
    useRegisterAppointmentContext();

  return (
    <>
      <Navbar title="Registrar atendimento" />
      <div className={styles.container}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {currentComponent}
        </form>
      </div>
    </>
  );
}
