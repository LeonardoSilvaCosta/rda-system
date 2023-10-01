"use client"

import { ClientFormValues } from '@/types/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { createContext, useContext, useState } from 'react';
import { Control, FieldErrors, SubmitHandler, UseFormGetValues, UseFormHandleSubmit, UseFormRegister, UseFormReset, UseFormWatch, useForm } from 'react-hook-form';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { citizenFormValidation, dependentFormValidation, militaryFormValidation } from '@/validation';
import * as yup from "yup"

interface GlobalContextProps {
  control: Control<any, any>
  errors: FieldErrors<ClientFormValues>,
  formType: string,
  getValues: UseFormGetValues<any>,
  handleSubmit: UseFormHandleSubmit<any, undefined>,
  onSubmit: SubmitHandler<ClientFormValues>,
  register: UseFormRegister<any>,
  reset: UseFormReset<any>,
  selectFormValidation: (formType: string) => JSX.Element,
  watch: UseFormWatch<any>,
}

const RegisterClientContext = createContext<GlobalContextProps | undefined>(undefined);

export const RegisterClientContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const supabase = createClientComponentClient();
  const [validationSchema, setValidationSchema] = useState<yup.ObjectSchema<{}>>(militaryFormValidation);

  const {
    handleSubmit,
    register,
    watch,
    control,
    getValues,
    reset,
    formState: { errors }
  } = useForm<ClientFormValues | any>({
    resolver: yupResolver(validationSchema)
  })

  const selectFormValidation = (formType: string) => {
    switch (formType) {
      case "militar":
        setValidationSchema(militaryFormValidation);
        break;
      case "dependente":
        setValidationSchema(dependentFormValidation);
        break;
      case "civil-sem-vínculo":
        setValidationSchema(citizenFormValidation);
        break;
      default:
        break;
    }
  }

  const onSubmit: SubmitHandler<ClientFormValues> = async (data) => {
    console.log(data)
    const birthDate = new Date(data.birthDate);
    const isCivilVolunteer = data.isCivilVolunteer === "Sim" ? true : false;

    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();

    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    try {
      await supabase.from("tb_attendeds").insert({
        fullname: data.fullName,
        nickname: data.nickName,
        rg: data.rg,
        rank: data.rank,
        cadre: data.cadre,
        opm: data.opm,
        gender: data.gender,
        cpf: data.cpf,
        birth_date: formattedDate,
        marital_status: data.maritalStatus,
        city_of_residence: data.cityOfResidence,
        policy_holder: data.policyHolder,
        is_civil_volunteer: isCivilVolunteer,
      });
      alert("Você cadastrou um novo usuário com sucesso.")

      reset();
    } catch (error) {
      alert(`Houve algum problema no cadastro de seu formulário. Erro ${error}. Tente novamente.`)
    }
  }

  return (
    <RegisterClientContext.Provider
      value={{
        control,
        errors,
        formType: 'clientRegister',
        getValues,
        handleSubmit,
        onSubmit,
        register,
        reset,
        selectFormValidation,
        watch,
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
