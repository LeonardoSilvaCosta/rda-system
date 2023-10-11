"use client"

import { AppointmentFormValues } from '@/types/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { Control, FieldErrors, SubmitHandler, UseFormClearErrors, UseFormGetValues, UseFormHandleSubmit, UseFormRegister, UseFormReset, UseFormSetValue, UseFormWatch, useForm } from 'react-hook-form';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { firstAppointmentStepValidation, secondAppointmentStepValidation } from '@/validation';
import * as yup from "yup"
import { useRouter } from 'next/navigation';
import { FirstAppointmentForm } from '@/components/RegisterAppointmentForm/FirstAppointmentForm';
import { SecondAppointmentForm } from '@/components/RegisterAppointmentForm/SecondAppointmentForm';

interface GlobalContextProps {
  clearErrors: UseFormClearErrors<any>,
  control: Control<any, any>
  errors: FieldErrors<AppointmentFormValues>,
  getValues: UseFormGetValues<any>,
  currentComponent: JSX.Element,
  goToNextStep: () => void,
  goToPreviousStep: () => void,
  handleSubmit: UseFormHandleSubmit<any, undefined>,
  isFirstStep: boolean,
  isLastStep: boolean,
  onSubmit: SubmitHandler<AppointmentFormValues>,
  register: UseFormRegister<any>,
  reset: UseFormReset<any>,
  selectFormValidation: (index: number) => void,
  setCurrentStep: Dispatch<SetStateAction<number>>,
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>,
}

const RegisterAppointmentContext = createContext<GlobalContextProps | undefined>(undefined);

export const RegisterAppointmentContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const supabase = createClientComponentClient();
  const router = useRouter();
  const [validationSchema, setValidationSchema] = useState<yup.ObjectSchema<{}>>(firstAppointmentStepValidation);

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
  } = useForm<AppointmentFormValues | any>({
    // resolver: yupResolver(validationSchema),
    defaultValues: {
      contacts: [{
        phone: '',
        ownerIdentification: '',
        attendedRelationship: '',
        attended_id: ''
      }]
    }
  })

  const [currentStep, setCurrentStep] = useState<number>(0);

  const scrollingTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  const formComponents = [
    <FirstAppointmentForm />,
    <SecondAppointmentForm />
  ]

  const returnToDashboard = () => {
    router.push('/')
  }

  useEffect(() => {
    console.log(errors)
  }, [errors])

  const totalSteps = 2;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep + 1 === totalSteps;

  const goToNextStep = () => {
    if (currentStep + 1 >= totalSteps) return;
    setCurrentStep(currentStep + 1);
    selectFormValidation(currentStep + 1);

    scrollingTop();
  }

  const goToPreviousStep = () => {
    if (currentStep - 1 < 0) { returnToDashboard(); return; };

    setCurrentStep(currentStep - 1);
    selectFormValidation(currentStep - 1);
  }

  const selectFormValidation = (index: number) => {
    switch (index) {
      case 0:
        setValidationSchema(firstAppointmentStepValidation);
        break;
      case 1:
        setValidationSchema(secondAppointmentStepValidation);
        break;
      default:
        return null;
    }
  }

  const onSubmit: SubmitHandler<AppointmentFormValues> = async (data) => {
    goToNextStep();

    if (isLastStep) {
      console.log("dados", data)
      // try {
      //   const saveRegister = async () => {
      //     const res = await supabase.from("tb_appointments").upsert({
      //       date: data.date,
      //       time: data.time,
      //       specialist: data.specialist,
      //       attended: data.attended,
      //       access: data.access,
      //       facility: data.facility,
      //       modality: data.modality,
      //       protocol: data.protocol,
      //       typeOfService: data.typeOfService,
      //       typeOfPsychologicalAssessment: data.typeOfPsychologicalAssessment,
      //       typeOfSocialAssessment: data.typeOfSocialAssessment,
      //       generalDemand: data.generalDemand,
      //       specificDemands: data.specificDemands.map(e => e.id),
      //       procedure: data.procedure,
      //       generatedDocuments: data.generatedDocuments.map(e => e.id),
      //       travels: data.travels.map(e => e.id),
      //       hasLeaveOfAbsence: data.hasLeaveOfAbsence,
      //     }).select();
      //   }

      //   saveRegister();

      //   alert("Você registrou um novo atendimento com sucesso.")

      //   reset();

      //   setCurrentStep(0);
      //   selectFormValidation(0);
      //   router.push("/")
      // } catch (error) {
      //   alert(`Houve algum problema no cadastro de seu formulário. Erro ${error}. Tente novamente.`)
      // }
    }
  }

  return (
    <RegisterAppointmentContext.Provider
      value={{
        clearErrors,
        control,
        currentComponent: formComponents[currentStep],
        errors,
        getValues,
        goToNextStep,
        goToPreviousStep,
        handleSubmit,
        isFirstStep,
        isLastStep,
        onSubmit,
        register,
        reset,
        setCurrentStep,
        selectFormValidation,
        setValue,
        watch,
      }}>
      {children}
    </RegisterAppointmentContext.Provider>
  );
}

export const useRegisterAppointmentContext = () => {
  const context = useContext(RegisterAppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointmentClientContext deve ser usado dentro de um GlobalContextProvider');
  }
  return context;
};
