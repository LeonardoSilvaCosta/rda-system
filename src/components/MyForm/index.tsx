"use client"

import { useGlobalContext } from '@/context/form';
import styles from './styles.module.scss';

export function MyForm() {
  const {
    handleSubmit,
    onSubmit,
    currentComponent
  } = useGlobalContext();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
    >
      {currentComponent}
    </form>
  )
}