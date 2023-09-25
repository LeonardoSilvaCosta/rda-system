"use client"

import { RDAFirstForm } from '@/components/RDAFirstForm';
import { RDAFourthForm } from '@/components/RDAFourthForm';
import { RDASecondForm } from '@/components/RDASecondForm';
import { RDAThirdForm } from '@/components/RDAThirdForm';
import { FormValues } from '@/types/types';
import { createContext, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';

interface GlobalContextProps {
  steps: JSX.Element[],
  currentStep: number,
  currentComponent: JSX.Element,
  changeStep: (index: number, event?: any) => void,
  isFirstStep: boolean,
  isLastStep: boolean,
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const {
    register,
    watch,
    control
  } = useForm<FormValues>()
  const [ currentStep, setCurrentStep ] = useState(0);

  const formComponents = [
    <RDAFirstForm register={register} control={control} watch={watch} />,
    <RDASecondForm register={register} control={control} />,
    <RDAThirdForm register={register} control={control} />,
    <RDAFourthForm register={register} control={control} />
  ]

  const changeStep = (index: number, event: any) => {
    if (index < 0 || index >= formComponents.length) return;

    setCurrentStep(index);
  }

  return (
    <GlobalContext.Provider
      value={{
        steps: formComponents,
        currentStep,
        currentComponent:formComponents[currentStep],
        changeStep,
        isFirstStep: currentStep === 0 ? true : false,
        isLastStep: currentStep + 1 === formComponents.length ? true : false
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
