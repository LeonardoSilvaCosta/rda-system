'use client';
import { useSearchParams } from 'next/navigation';

import styles from './styles.module.scss';

import { Navbar } from '@/components/Navbar';
import { useRegisterClientContext } from '@/context/registerClientContext';

export default function Form() {
  const { currentComponent, handleSubmit, onSubmit } =
    useRegisterClientContext();
  const searchParams = useSearchParams();
  const formType = searchParams.get('type');

  if (!formType) {
    alert(`Tipo de formulário não identificado: ${formType}. Tente novamente.`);
    return;
  }

  return (
    <>
      <Navbar title="Cadastrar atendido" />
      <div className={styles.container}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {currentComponent}
        </form>
      </div>
    </>
  );
}
