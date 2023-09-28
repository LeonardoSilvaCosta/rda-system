"use client"

import { useRegisterClientContext } from '@/context/registerClientContext';
import styles from './styles.module.scss';
import { RegisterClientFirstStep } from '@/components/RegisterClientForm/firstStep';

export default function RegisterClient() {
  const {
    control,
    handleSubmit,
    onSubmit,
    register,
    watch
  } = useRegisterClientContext();

  return (
    <div className={styles.container}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}
      >
       <RegisterClientFirstStep control={control} register={register} watch={watch} />
      </form>
    </div>
  )
}