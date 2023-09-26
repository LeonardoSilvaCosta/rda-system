"use client"

import { ClientFormValues } from '@/types/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { createContext, useContext, useState } from 'react';
import { FieldErrors, SubmitHandler, UseFormGetValues, UseFormHandleSubmit, useForm } from 'react-hook-form';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import * as yup from "yup"
import { RegisterClientFirstStep } from '@/components/RegisterClientForm/firstStep';
import { clientFormStepOne } from '@/validation';

interface GlobalContextProps {
  currentComponent: JSX.Element,
  currentStep: number,
  errors: FieldErrors<ClientFormValues>,
  getValues: UseFormGetValues<any>,
  goToPreviousStep: (index: number) => void,
  handleSubmit: UseFormHandleSubmit<any, undefined>,
  isFirstStep: boolean,
  isLastStep: boolean,
  onSubmit: SubmitHandler<ClientFormValues>,
  steps: JSX.Element[],
}

const RegisterClientContext = createContext<GlobalContextProps | undefined>(undefined);

export const RegisterClientContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const supabase = createClientComponentClient();
  const [validationSchema, setValidationSchema] = useState<yup.ObjectSchema<{}>>(clientFormStepOne);

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
  const [currentStep, setCurrentStep] = useState(0);

  const scrollingTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  const formComponents = [
    <RegisterClientFirstStep register={register} control={control} watch={watch} />,
  ]

  const isFirstStep = currentStep === 0 ? true : false;
  const isLastStep = currentStep + 1 === formComponents.length ? true : false;

  const goToNextStep = () => {
    if (currentStep + 1 >= formComponents.length) return;
    if (currentStep === 1 && getValues("eDependente") === "Não") {
      setCurrentStep(currentStep + 2);
      selectStepValidation(currentStep + 2);
    } else {
      setCurrentStep(currentStep + 1);
      selectStepValidation(currentStep + 1);
    }

    scrollingTop();
  }

  const goToPreviousStep = () => {
    if (currentStep - 1 < 0) return;
    if (currentStep === 3 && getValues("eDependente") === "Não") {
      setCurrentStep(currentStep - 2);
      selectStepValidation(currentStep - 2);
    } else {
      setCurrentStep(currentStep - 1);
      selectStepValidation(currentStep - 1);
    }
  }

  const selectStepValidation = (index: number) => {
    switch (index) {
      case 0:
        setValidationSchema(clientFormStepOne);
        break;
      // case 1:
      //   setValidationSchema(stepTwoValidation);
      //   break;
      // case 2:
      //   setValidationSchema(stepThreeValidation);
      //   break;
      // case 3:
      //   setValidationSchema(stepFourValidation);
      //   break;
      default:
        break;
    }
  }

  const onSubmit: SubmitHandler<ClientFormValues> = async (data) => {
    goToNextStep();

    if (isLastStep) {
      try {
        await supabase.from("clients").insert({ data });
        alert("Você cadastrou um novo usuário com sucesso.")

        reset();
        setCurrentStep(0);
        scrollingTop();
      } catch (error) {
        alert("Houve algum problema no cadastro de seu formulário. Tente novamente.")
      }
    }
  }

  return (
    <RegisterClientContext.Provider
      value={{
        currentComponent: formComponents[currentStep],
        currentStep,
        errors,
        getValues,
        goToPreviousStep,
        handleSubmit,
        isFirstStep,
        isLastStep,
        onSubmit,
        steps: formComponents
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
