"use client";
import { useEffect, useState } from "react";
// import {} from 'react-icons';

import { createClientComponentClient, Session } from "@supabase/auth-helpers-nextjs";

import styles from './styles.module.scss';
import Image from "next/image";
import { Input } from "@/components/Input";
import { useLoginClientContext } from "@/context/loginContext";
import { Button } from "@/components/Button";

export default function Login() {
  const { errors, register, handleSubmit, onSubmit } = useLoginClientContext();


  // const [toast, setToaste] = useState<TypeToast>({
  //   enable: false,
  //   title: "",
  //   description: "",
  //   buttonVariant: "secondary"
  // });
  const [user, setUser] = useState<Session>();
  const [magicLink, setMagicLink] = useState<boolean>(false);
  const supabase = createClientComponentClient();

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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
        >
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
          <Button
            type={'submit'}
            name={'Entrar'}
          />
        </form>
      </div>
    </main>
  );
};