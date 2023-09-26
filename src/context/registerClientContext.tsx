"use client"

import { ClientFormValues } from '@/types/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { createContext, useContext } from 'react';
import { Control, FieldErrors, SubmitHandler, UseFormGetValues, UseFormHandleSubmit, UseFormRegister, UseFormWatch, useForm } from 'react-hook-form';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { clientFormStepOne } from '@/validation';

interface GlobalContextProps {
  control: Control<any, any>
  errors: FieldErrors<ClientFormValues>,
  getValues: UseFormGetValues<any>,
  handleSubmit: UseFormHandleSubmit<any, undefined>,
  onSubmit: SubmitHandler<ClientFormValues>,
  register: UseFormRegister<any>,
  watch: UseFormWatch<any> ,
}

const RegisterClientContext = createContext<GlobalContextProps | undefined>(undefined);

export const RegisterClientContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const supabase = createClientComponentClient();

  const {
    handleSubmit,
    register,
    watch,
    control,
    getValues,
    reset,
    formState: { errors }
  } = useForm<ClientFormValues | any>({
    resolver: yupResolver(clientFormStepOne)
  })

  const onSubmit: SubmitHandler<ClientFormValues> = async (data) => {
    try {
      await supabase.from("clients").insert({ data });
      alert("Você cadastrou um novo usuário com sucesso.")

      reset();
    } catch (error) {
      alert("Houve algum problema no cadastro de seu formulário. Tente novamente.")
    }
  }

  return (
    <RegisterClientContext.Provider
      value={{
        control,
        errors,
        getValues,
        handleSubmit,
        onSubmit,
        register,
        watch
      }}>
      {children}
    </RegisterClientContext.Provider>
  );
}

export const useRegisterClientContext = () => {
  const context = useContext(RegisterClientContext);
  if (context === undefined) {
    throw new Error('useRegisterClientContext deve ser usado dentro de um GlobalContextProvider');
  }
  return context;
};
