'use client';
import Image from 'next/image';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import styles from './styles.module.scss';

import { Button } from '@/components/Button';
import { useGlobalContext } from '@/context/globalContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import * as yup from 'yup';

interface FormValues extends FieldValues {
  password: string;
}

export default function RedefinePassword() {
  const supabase = createClientComponentClient();
  const { returnToDashboard } = useGlobalContext();

  const validationSchema = yup.object({
    password: yup
      .string()
      .required('É necessário que você forneça uma nova senha.')
      .min(6, 'A senha deve conter pelo menos 6 caracteres.')
  });

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset
  } = useForm<FormValues>({ resolver: yupResolver(validationSchema) });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });

      if (!error) {
        toast.success('Sua senha foi redefinida com sucesso.');
        returnToDashboard();
      } else {
        toast.error(error.message);
        // toast.error('A nova senha deve ser diferente da anterior.');
      }
    } catch (error) {
      toast.error(
        `Houve algum problema na redefinição de senha. Erro ${error}. Tente novamente.`
      );
    } finally {
      reset();
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.box}>
        <header className={styles.firstBox}>
          <Image
            src="/brasao-ciap.png"
            alt="Brasão do CIAP"
            width={300}
            height={349.47}
          />
          <span>CENTRO INTEGRADO DE ATENÇÃO PSICOSSOCIAL</span>
        </header>
        <div className={styles.secondBox}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <label>Insira a sua nova senha.</label>
            <input
              type={'password'}
              placeholder={'Sua senha'}
              {...register('password')}
            />
            {errors['password'] && (
              <span className="error-message">
                {String(errors['password']?.message)}
              </span>
            )}
            <Button type={'submit'} name={'Enviar'} />
          </form>
        </div>
      </div>
    </main>
  );
}
