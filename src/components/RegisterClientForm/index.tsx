"use client"

import { useRegisterClientContext } from '@/context/registerClientContext';
import styles from './styles.module.scss';

export function RegisterClientForm() {
  const {
    handleSubmit,
    onSubmit,
    currentComponent
  } = useRegisterClientContext();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
    >
      {currentComponent}
    </form>
  )
}