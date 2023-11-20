/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext } from 'react';
import {
  Control,
  FieldErrors,
  SubmitHandler,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
  useForm
} from 'react-hook-form';
import toast from 'react-hot-toast';

import { useGlobalContext } from './globalContext';

import { LoginFormValues } from '@/types/types';
import { loginValidation } from '@/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface LoginContextProps {
  clearErrors: UseFormClearErrors<any>;
  control: Control<any, any>;
  errors: FieldErrors<LoginFormValues>;
  getValues: UseFormGetValues<any>;
  handleSubmit: UseFormHandleSubmit<any, undefined>;
  isSubmitting: boolean;
  onSubmit: SubmitHandler<LoginFormValues>;
  register: UseFormRegister<any>;
  reset: UseFormReset<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

const LoginContext = createContext<LoginContextProps | undefined>(undefined);

export const LoginContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const {
    clearErrors,
    control,
    formState: { errors, isSubmitting },
    getValues,
    handleSubmit,
    register,
    reset,
    setValue,
    watch
  } = useForm<LoginFormValues | any>({
    resolver: yupResolver(loginValidation),
    defaultValues: { email: '', password: '' }
  });

  const { setCurrentUser } = useGlobalContext();

  async function getCurrentUser(userEmail: string) {
    const data = await fetch(`/api/get_current_user?email=${userEmail}`);
    const userData = await data.json();
    setCurrentUser(userData);
  }

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const res = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (res.data.user) {
        toast.success('Autenticado com sucesso!');
        getCurrentUser(String(res.data.user.email));
        router.refresh();
      } else {
        toast.error('Login ou senha inválidos.');
      }
    } catch (error) {
      toast.error(
        `Houve algum problema no cadastro de seu formulário. Erro ${error}. Tente novamente.`
      );
    }
  };

  return (
    <LoginContext.Provider
      value={{
        clearErrors,
        control,
        errors,
        getValues,
        handleSubmit,
        isSubmitting,
        onSubmit,
        register,
        reset,
        setValue,
        watch
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLoginClientContext = () => {
  const context = useContext(LoginContext);
  if (context === undefined) {
    throw new Error(
      'useLoginContext deve ser usado dentro de um GlobalContextProvider'
    );
  }
  return context;
};
