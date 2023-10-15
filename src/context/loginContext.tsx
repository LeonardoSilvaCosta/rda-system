"use client"

import { LoginFormValues } from '@/types/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { createContext, useContext, useEffect } from 'react';
import { Control, FieldErrors, SubmitHandler, UseFormClearErrors, UseFormGetValues, UseFormHandleSubmit, UseFormRegister, UseFormReset, UseFormSetValue, UseFormWatch, useForm } from 'react-hook-form';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import * as yup from "yup"
import { useRouter } from 'next/navigation';
import { loginValidation } from '@/validation';

interface GlobalContextProps {
  clearErrors: UseFormClearErrors<any>,
  control: Control<any, any>
  errors: FieldErrors<LoginFormValues>,
  getValues: UseFormGetValues<any>,
  handleSubmit: UseFormHandleSubmit<any, undefined>,
  onSubmit: SubmitHandler<LoginFormValues>,
  register: UseFormRegister<any>,
  reset: UseFormReset<any>,
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>,
}

const LoginContext = createContext<GlobalContextProps | undefined>(undefined);

export const LoginContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const supabase = createClientComponentClient();
  const router = useRouter();

  const {
    clearErrors,
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    reset,
    setValue,
    watch
  } = useForm<LoginFormValues | any>({
    resolver: yupResolver(loginValidation),
    defaultValues: { email: '', password: ''}
  })

  const goToDashboard = () => {
    router.push('/')
  }

  useEffect(() => {
    console.log(errors)
  }, [errors])

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
      try {
        const res = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: `${location.origin}/callback`,
          },
        })

        if(res.data.session) alert('Autenticado com sucesso!')

        alert(JSON.stringify(res, null, 2))

        // reset();

        // goToDashboard();
      } catch (error) {
        alert(`Houve algum problema no cadastro de seu formulário. Erro ${error}. Tente novamente.`)
      }
  }

  return (
    <LoginContext.Provider
      value={{
        clearErrors,
        control,
        errors,
        getValues,
        handleSubmit,
        onSubmit,
        register,
        reset,
        setValue,
        watch,
      }}>
      {children}
    </LoginContext.Provider>
  );
}


export const useLoginClientContext = () => {
  const context = useContext(LoginContext);
  if (context === undefined) {
    throw new Error('useLoginContext deve ser usado dentro de um GlobalContextProvider');
  }
  return context;
};
