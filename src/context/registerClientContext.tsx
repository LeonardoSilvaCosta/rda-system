"use client"

import { ClientFormValues } from '@/types/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { createContext, useContext, useEffect, useState } from 'react';
import { Control, FieldErrors, SubmitHandler, UseFormGetValues, UseFormHandleSubmit, UseFormRegister, UseFormReset, UseFormSetValue, UseFormWatch, useForm } from 'react-hook-form';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { addressFormValidation, citizenFormValidation, contactFormValidation, dependentFormValidation, militaryFormValidation } from '@/validation';
import * as yup from "yup"
import { useRouter } from 'next/navigation';
import { FirstClientForm } from '@/components/RegisterClientForm/FirstClientForm';
import { SecondClientForm } from '@/components/RegisterClientForm/SecondClientForm';
import { ThirdClientForm } from '@/components/RegisterClientForm/ThidClientForm';

interface GlobalContextProps {
  control: Control<any, any>
  errors: FieldErrors<ClientFormValues>,
  formType: string,
  getValues: UseFormGetValues<any>,
  getCurrentStepForm: (typeForm?: string) => JSX.Element | null,
  goToNextStep: () => void,
  goToPreviousStep: () => void,
  handleSubmit: UseFormHandleSubmit<any, undefined>,
  isFirstStep: boolean,
  isLastStep: boolean,
  onSubmit: SubmitHandler<ClientFormValues>,
  register: UseFormRegister<any>,
  reset: UseFormReset<any>,
  selectFormValidation: (index: number, formType: string) => void,
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>,
}

const RegisterClientContext = createContext<GlobalContextProps | undefined>(undefined);

export const RegisterClientContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const supabase = createClientComponentClient();
  const router = useRouter();
  const [validationSchema, setValidationSchema] = useState<yup.ObjectSchema<{}>>(militaryFormValidation);

  const {
    handleSubmit,
    register,
    watch,
    control,
    getValues,
    reset,
    setValue,
    formState: { errors }
  } = useForm<ClientFormValues | any>({
    resolver: yupResolver(validationSchema)
  })

  const [currentStep, setCurrentStep] = useState(0);

  const scrollingTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  const getCurrentStepForm = (typeForm?: string) => {
    switch (currentStep) {
      case 0:
        return <FirstClientForm type={typeForm ? typeForm : null} register={register} control={control} watch={watch} />;
      case 1:
        return <SecondClientForm register={register} control={control} />;
      case 2:
        return <ThirdClientForm register={register} control={control} />;
      default:
        return null;
    }
  };


  const totalSteps = 3;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep + 1 === totalSteps - 1;

  const goToNextStep = () => {
    if (currentStep + 1 >= totalSteps) return;
    setCurrentStep(currentStep + 1);
    selectFormValidation(currentStep + 1);

    scrollingTop();
  }

  const goToPreviousStep = () => {
    if (currentStep - 1 < 0) return;

    setCurrentStep(currentStep - 1);
    selectFormValidation(currentStep - 1);
  }

  useEffect(() => {
    selectFormValidation(currentStep);
  }, [currentStep]);


  const selectFormValidation = (index: number, formType?: string) => {
    switch (index) {
      case 0:
        if (formType === "militar") {
          setValidationSchema(militaryFormValidation);
        } else if (formType === "dependente") {
          setValidationSchema(dependentFormValidation);
        } else {
          setValidationSchema(citizenFormValidation);
        }
        break;
      case 1:
        setValidationSchema(addressFormValidation);
        break;
      case 2:
        setValidationSchema(contactFormValidation);
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
      const { data: attendedExists } = await supabase
        .from("tb_attendeds")
        .select()
        .eq('cpf', data.cpf);

      if (attendedExists?.length !== 0) {
        alert("Já há um atendido cadastrado com esse CPF em nosso banco de dados.")
        return;
      }

      await supabase.from("tb_attendeds").insert({
        fullname: data.fullName,
        nickname: data.nickName,
        rg: data.rg,
        rank_id: data.rank,
        cadre_id: data.cadre,
        opm_id: data.opm,
        work_status: data.workStatus,
        gender_id: data.gender,
        cpf: data.cpf,
        birth_date: formattedDate,
        marital_status_id: data.maritalStatus,
        policy_holder_id: data.policyHolder,
        familiar_bond: data.familiarBond,
        is_civil_volunteer: isCivilVolunteer,
      });
      alert("Você cadastrou um novo usuário com sucesso.")

      reset();
      router.push("/RegisterClient/Options")
    } catch (error) {
      alert(`Houve algum problema no cadastro de seu formulário. Erro ${error}. Tente novamente.`)
    }
  }

  return (
    <RegisterClientContext.Provider
      value={{
        control,
        getCurrentStepForm,
        errors,
        formType: 'clientRegister',
        getValues,
        goToNextStep,
        goToPreviousStep,
        handleSubmit,
        isFirstStep,
        isLastStep,
        onSubmit,
        register,
        reset,
        selectFormValidation,
        setValue,
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
