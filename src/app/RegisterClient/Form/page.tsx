"use client"
import { useRegisterClientContext } from '@/context/registerClientContext';
import styles from './styles.module.scss';
import { Header } from '@/components/Header';
import { useSearchParams } from 'next/navigation'
import { FormComponent } from '@/components/RegisterClientForm/FormComponent';
import { Suspense } from 'react';
import { LoadingComponent } from '@/components/Loading/loading';

export default function Form() {
  const {
    control,
    handleSubmit,
    onSubmit,
    register,
    watch
  } = useRegisterClientContext();
  const searchParams = useSearchParams()
  const formType = searchParams.get('type')

  return (
    <>
      <Header title='Cadastrar atendido' />
      <div className={styles.container}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
        >
          <FormComponent type={formType} control={control} register={register} watch={watch} />
        </form>
      </div>
    </>
  )
}