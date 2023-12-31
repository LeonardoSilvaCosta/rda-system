'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import styles from './styles.module.scss';

import { Button } from '@/components/Button';
import { useLoginClientContext } from '@/context/loginContext';

export default function Login() {
  const { errors, register, handleSubmit, isSubmitting, onSubmit } =
    useLoginClientContext();

  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => {
    setIsLoading(true);
  };

  return (
    <main className={styles.container}>
      <div className={styles.loginBox}>
        <header className={styles.firstBox}>
          <Image
            src="/brasao-ciap.png"
            alt="Brasão do CIAP"
            width={300}
            height={349.47}
            priority
          />
          <span>CENTRO INTEGRADO DE ATENÇÃO PSICOSSOCIAL</span>
        </header>
        <div className={styles.secondBox}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {/* substituir esses inputs pelos inputs normais. Os inputs customizados geram efeitos indesejados na tela de login */}
            <label>Email</label>
            <input
              type={'email'}
              placeholder={'Seu email'}
              autoComplete="username"
              {...register('email')}
            />
            {errors['email'] && (
              <span className="error-message">
                {String(errors['email']?.message)}
              </span>
            )}
            <input
              type={'password'}
              placeholder={'Sua senha'}
              autoComplete="current-password"
              {...register('password')}
            />
            {errors['password'] && (
              <span className="error-message">
                {String(errors['password']?.message)}
              </span>
            )}
            <Button
              disabled={isSubmitting}
              isSubmitting={isSubmitting}
              type={'submit'}
              name={'Entrar'}
            />
            <Link
              href="/forgotPassword"
              onClick={startLoading}
              className={`${isLoading ? styles.loading : ''}`}
            >
              <span>Esqueci a senha</span>
            </Link>
          </form>
        </div>
      </div>
    </main>
  );
}
