"use client"

import { RDAFirstForm } from '@/components/RDAFirstForm';
import { RDAFourthForm } from '@/components/RDAFourthForm';
import { RDASecondForm } from '@/components/RDASecondForm';
import { RDAThirdForm } from '@/components/RDAThirdForm';
import { FormValues } from '@/types/types';
import { stepFourValidation, stepOneValidation, stepThreeValidation, stepTwoValidation } from '@/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { createContext, useContext, useRef, useState } from 'react';
import { FieldErrors, SubmitHandler, UseFormGetValues, UseFormHandleSubmit, useForm } from 'react-hook-form';

import * as yup from "yup"

interface GlobalContextProps {
  changeStep: (index: number) => void,
  currentComponent: JSX.Element,
  currentStep: number,
  errors: FieldErrors<FormValues>,
  getValues: UseFormGetValues<any>,
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

  const [validationSchema, setValidationSchema] = useState<yup.ObjectSchema<{}>>(stepOneValidation);

  const {
    handleSubmit,
    register,
    watch,
    control,
    getValues,
    formState: { errors }
  } = useForm<FormValues | any>({
    resolver: yupResolver(validationSchema)
  })
  const [currentStep, setCurrentStep] = useState(0);

  const scrollingTop = (currentStep: number, index: number) => {
    if(currentStep < index) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }

  const formComponents = [
    <RDAFirstForm register={register} control={control} watch={watch} />,
    <RDASecondForm register={register} control={control} />,
    <RDAThirdForm register={register} control={control} />,
    <RDAFourthForm register={register} control={control} />
  ]

  const changeStep = (index: number) => {
    if (index < 0 || index >= formComponents.length) return;

    scrollingTop(currentStep, index)
    setCurrentStep(index);

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

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    changeStep(currentStep + 1)
  }

  return (
    <GlobalContext.Provider
      value={{
        changeStep,
        currentComponent: formComponents[currentStep],
        currentStep,
        errors,
        getValues,
        handleSubmit,
        isFirstStep: currentStep === 0 ? true : false,
        isLastStep: currentStep + 1 === formComponents.length ? true : false,
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
