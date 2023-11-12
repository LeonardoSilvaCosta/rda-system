'use client';
import Image from 'next/image';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import styles from './styles.module.scss';

import { Button } from '@/components/Button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface FormValues extends FieldValues {
  email: string;
}

export default function ForgotPassword() {
  const supabase = createClientComponentClient();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: process.env.NEXT_PUBLIC_REDEFINE_PASSWORD_URL
      });

      if (!error) {
        toast.success(
          'Um link para redefinição de senha foi enviado para o seu email.'
        );
      } else {
        toast.error('Email não encontrado.');
      }
    } catch (error) {
      toast.error(
        `Houve algum problema no envio do email. Erro ${error}. Tente novamente.`
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
            {/* substituir esses inputs pelos inputs normais. Os inputs customizados geram efeitos indesejados na tela de login */}
            <label>
              Insira o seu email. Um link de redefinição de senha será enviado.
            </label>
            <input
              type={'email'}
              placeholder={'Seu email'}
              {...register('email')}
            />
            {errors['email'] && (
              <span className="error-message">
                {String(errors['email']?.message)}
              </span>
            )}
            <Button type={'submit'} name={'Entrar'} />
          </form>
        </div>
      </div>
    </main>
  );
}
