"use client"

import { RDAFirstForm } from '@/components/RDAFirstForm';
import { RDAFourthForm } from '@/components/RDAFourthForm';
import { RDASecondForm } from '@/components/RDASecondForm';
import { RDAThirdForm } from '@/components/RDAThirdForm';
import { FormValues } from '@/types/types';
import { stepFourValidation, stepOneValidation, stepThreeValidation, stepTwoValidation } from '@/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { createContext, useContext, useState } from 'react';
import { FieldErrors, SubmitHandler, UseFormGetValues, UseFormHandleSubmit, useForm } from 'react-hook-form';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import * as yup from "yup"

interface GlobalContextProps {
  currentComponent: JSX.Element,
  currentStep: number,
  errors: FieldErrors<FormValues>,
  getValues: UseFormGetValues<any>,
  goToPreviousStep: (index: number) => void,
  handleSubmit: UseFormHandleSubmit<any, undefined>,
  isFirstStep: boolean,
  isLastStep: boolean,
  onSubmit: SubmitHandler<FormValues>,
  steps: JSX.Element[],
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const supabase = createClientComponentClient();
  const [validationSchema, setValidationSchema] = useState<yup.ObjectSchema<{}>>(stepOneValidation);

  const {
    handleSubmit,
    register,
    watch,
    control,
    getValues,
    reset,
    formState: { errors }
  } = useForm<FormValues | any>({
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
    <RDAFirstForm register={register} control={control} watch={watch} />,
    <RDASecondForm register={register} control={control} />,
    <RDAThirdForm register={register} control={control} />,
    <RDAFourthForm register={register} control={control} watch={watch} />
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
        setValidationSchema(stepOneValidation);
        break;
      case 1:
        setValidationSchema(stepTwoValidation);
        break;
      case 2:
        setValidationSchema(stepThreeValidation);
        break;
      case 3:
        setValidationSchema(stepFourValidation);
        break;
      default:
        break;
    }
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    goToNextStep();

    if (isLastStep) {
      try {
        await supabase.from("rda").insert({ acesso: data.acesso });
        alert("O CIAP agradece o seu RDA :)")

        reset();
        setCurrentStep(0);
        scrollingTop();
      } catch (error) {
        alert("Houve algum problema no cadastro de seu formulário. Tente novamente.")
      }
    }
  }

  return (
    <GlobalContext.Provider
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
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext deve ser usado dentro de um GlobalContextProvider');
  }
  return context;
};