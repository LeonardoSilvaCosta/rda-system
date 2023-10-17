'use client';
import Image from 'next/image';
import { Toaster } from 'react-hot-toast';

import styles from './styles.module.scss';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useLoginClientContext } from '@/context/loginContext';

export default function Login() {
  const { errors, register, handleSubmit, onSubmit } = useLoginClientContext();

  return (
    <main className={styles.container}>
      <div className={styles.loginBox}>
        <header className={styles.imageContainer}>
          <Image
            src="/brasao-ciap.png"
            alt="Brasão do CIAP"
            width={120}
            height={169.79}
          />
        </header>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            title={'Email'}
            type={'email'}
            name={'email'}
            hint={'Seu email'}
            icon={'seuIcon'}
            errors={errors}
            register={register}
          />
          <Input
            title={'Senha'}
            type={'password'}
            name={'password'}
            hint={'******'}
            icon={'seuIcon'}
            errors={errors}
            register={register}
          />
          <Button type={'submit'} name={'Entrar'} />
          <Toaster />
        </form>
      </div>
    </main>
  );
}
