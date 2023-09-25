"use client"

import { RDAFirstForm } from '@/components/RDAFirstForm';
import { RDAFourthForm } from '@/components/RDAFourthForm';
import { RDASecondForm } from '@/components/RDASecondForm';
import { RDAThirdForm } from '@/components/RDAThirdForm';
import { FormValues } from '@/types/types';
import { createContext, useContext, useState } from 'react';
import { FieldErrors, UseFormHandleSubmit, useForm } from 'react-hook-form';

import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

interface GlobalContextProps {
  changeStep: (index: number) => void,
  currentComponent: JSX.Element,
  currentStep: number,
  errors: FieldErrors<FormValues>,
  handleSubmit: UseFormHandleSubmit<FormValues, undefined>
  isFirstStep: boolean,
  isLastStep: boolean,
  steps: JSX.Element[],
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const schema = yup
    .object({
      data: yup.date().required(),
      horario: yup.string().required(),
      recepcionista: yup.string().required(),
      oficial: yup.string().required(),
      acesso: yup.string().required(),
      local: yup.string().required(),
      temProtocolo: yup.boolean().required(),
      modalidade: yup.string().required(),
      protocolo: yup.string().required(),
      identificacaoPM: yup.string().required(),
      opm: yup.string().required(),
      sexoPM: yup.string().required(),
      dataDeNascimentoPM: yup.date().required(),
      cidadeEmQueResidePM: yup.string().required(),
      estadoCivilPM: yup.string().required(),
      eDependente: yup.boolean().required(),
      identificacaoDependente: yup.string().required(),
      sexoDependente: yup.string().required(),
      dataDeNascimentoDependente: yup.date().required(),
      cidadeEmQueResideDependente: yup.string().required(),
      estadoCivilDependente: yup.string().required(),
      tipoDeServico: yup.string().required(),
      tipoDeAvaliacaoPsicologica: yup.string().required(),
      tipoDeAvaliacaoSocial: yup.string().required(),
      demandaGeral: yup.string().required(),
      tiposDeDemandaEspecifica: yup.array().required(),
      procedimento: yup.string().required(),
      documentosProduzidos: yup.array().required(),
      deslocamentos: yup.array().required(),
      houveAfastamento: yup.boolean().required()
    })
  const {
    handleSubmit,
    register,
    watch,
    control,
    formState: { errors }
  } = useForm<FormValues>({
   
  })
  const [currentStep, setCurrentStep] = useState(0);

  const formComponents = [
    <RDAFirstForm register={register} control={control} watch={watch} />,
    <RDASecondForm register={register} control={control} />,
    <RDAThirdForm register={register} control={control} />,
    <RDAFourthForm register={register} control={control} />
  ]

  const changeStep = (index: number) => {
    if (index < 0 || index >= formComponents.length) return;

    setCurrentStep(index);
  }

  return (
    <GlobalContext.Provider
      value={{
        changeStep,
        currentComponent: formComponents[currentStep],
        currentStep,
        errors,
        handleSubmit,
        isFirstStep: currentStep === 0 ? true : false,
        isLastStep: currentStep + 1 === formComponents.length ? true : false,
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
