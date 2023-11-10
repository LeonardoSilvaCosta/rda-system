'use client';

import styles from './styles.module.scss';

import { Header } from '@/components/Header';
import { useRegisterUserContext } from '@/context/registerUserContext';

export default function Form() {
  const { currentComponent, handleSubmit, onSubmit } = useRegisterUserContext();

  return (
    <>
      <Header title="Cadastrar usuário" />
      <div className={styles.container}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {currentComponent}
        </form>
      </div>
    </>
  );
}
