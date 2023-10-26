/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRouter } from 'next/navigation';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState
} from 'react';
import {
  Control,
  FieldErrors,
  SubmitHandler,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
  UseFormSetError,
  UseFormSetValue,
  UseFormWatch,
  useForm
} from 'react-hook-form';
import toast from 'react-hot-toast';

import { useGlobalContext } from './globalContext';

import { FirstAppointmentForm } from '@/components/RegisterAppointmentForm/FirstAppointmentForm';
import { SecondAppointmentForm } from '@/components/RegisterAppointmentForm/SecondAppointmentForm';
import { AppointmentFormValues } from '@/types/types';
import {
  firstAppointmentStepValidation,
  secondAppointmentStepValidation
} from '@/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import * as yup from 'yup';

interface RegisterAppointmentContextProps {
  clearErrors: UseFormClearErrors<any>;
  control: Control<any, any>;
  errors: FieldErrors<AppointmentFormValues>;
  getValues: UseFormGetValues<any>;
  currentComponent: JSX.Element;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  handleSubmit: UseFormHandleSubmit<any, undefined>;
  isFirstStep: boolean;
  isLastStep: boolean;
  onSubmit: SubmitHandler<AppointmentFormValues>;
  register: UseFormRegister<any>;
  reset: UseFormReset<any>;
  selectFormValidation: (index: number) => void;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  setError: UseFormSetError<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

const RegisterAppointmentContext = createContext<
  RegisterAppointmentContextProps | undefined
>(undefined);

export const RegisterAppointmentContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { returnToDashboard } = useGlobalContext();
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [validationSchema, setValidationSchema] = useState<
    yup.ObjectSchema<object>
  >(firstAppointmentStepValidation);

  const {
    clearErrors,
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    watch
  } = useForm<AppointmentFormValues | any>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      contacts: [
        {
          date: null,
          time: '',
          specialists: [],
          attendeds: [],
          access: '',
          facility: '',
          modality: '',
          hasProtocol: '',
          protocol: '',
          typeOfService: '',
          typeOfPsychologicalAssessment: '',
          typeOfSocialAssessment: '',
          generalDemand: '',
          specificDemands: [],
          procedure: '',
          hasFirstOptionWithoutSecondOption: false,
          referrals: [],
          documents: [],
          travels: [],
          hasLeaveOfAbsence: '',
          recordProgress: ''
        }
      ]
    }
  });

  const [currentStep, setCurrentStep] = useState<number>(0);

  const scrollingTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const formComponents = [
    <FirstAppointmentForm key="first" />,
    <SecondAppointmentForm key="second" />
  ];

  const totalSteps = 2;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep + 1 === totalSteps;

  const goToNextStep = () => {
    if (currentStep + 1 >= totalSteps) return;
    setCurrentStep(currentStep + 1);
    selectFormValidation(currentStep + 1);

    scrollingTop();
  };

  const goToPreviousStep = () => {
    if (currentStep - 1 < 0) {
      returnToDashboard();
      return;
    }

    setCurrentStep(currentStep - 1);
    selectFormValidation(currentStep - 1);
  };

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
  };

  const onSubmit: SubmitHandler<AppointmentFormValues> = async (data) => {
    goToNextStep();
    if (isLastStep) {
      console.log('dados', data);
      try {
        const { data: logedUserData } = await supabase.auth.getUser();
        const userEmail = logedUserData.user?.email;
        const { data: userData } = await supabase
          .from('tb_users')
          .select()
          .eq('email', userEmail)
          .single();

        const hasLeaveOfAbsence =
          data.hasLeaveOfAbsence === 'Sim' ? true : false;
        const date = new Date(data.date);

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const formattedDate = `${year}-${month
          .toString()
          .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        const newDate = new Date();
        const [hour, minutes] = data.time.split(':');
        newDate.setHours(Number(hour), Number(minutes), 0);

        const formattedHour = newDate.toLocaleTimeString('en-US', {
          hour12: false
        });

        const saveRegister = async () => {
          const { data: appointmentData, error: appointmentError } =
            await supabase
              .from('tb_appointments')
              .insert({
                date: formattedDate,
                time: formattedHour,
                access_id: data.access,
                facility_id: data.facility,
                modality_id: data.modality,
                protocol: data.protocol,
                type_of_service_id: data.typeOfService,
                type_of_psychological_assessment_id:
                  data.typeOfPsychologicalAssessment,
                type_of_social_assessment_id: data.typeOfSocialAssessment,
                general_demand_id: data.generalDemand,
                procedure_id: data.procedure,
                has_leave_of_absence: hasLeaveOfAbsence,
                record_progress: data.recordProgress,
                registered_by: await userData.id
              })
              .select();

          if (appointmentError) {
            toast.error('Erro na transação, atendimento não cadastrado');
            return;
          }

          const appointmentId = appointmentData && appointmentData[0].id;

          const specialists =
            data.specialists.length > 0
              ? data.specialists.map((specialist) => {
                  return {
                    appointment_id: appointmentId,
                    specialist_id: specialist
                  };
                })
              : [];

          await supabase
            .from('tb_appointments_specialists')
            .insert(specialists);

          const attendeds =
            data.attendeds.length > 0
              ? data.attendeds.map((attended) => {
                  return {
                    appointment_id: appointmentId,
                    attended_id: attended
                  };
                })
              : [];

          await supabase.from('tb_appointments_attendeds').insert(attendeds);

          const specificDemands =
            data.specificDemands.length > 0
              ? data.specificDemands.map((specificDemand) => {
                  return {
                    appointment_id: appointmentId,
                    specific_demand_id: specificDemand
                  };
                })
              : [];

          await supabase
            .from('tb_appointments_specific_demands')
            .insert(specificDemands);

          const documents =
            data.documents.length > 0
              ? data.documents.map((document) => {
                  return {
                    appointment_id: appointmentId,
                    document_id: document
                  };
                })
              : [];

          await supabase.from('tb_appointments_documents').insert(documents);

          const travels =
            data.travels.length > 0
              ? data.travels.map((travel) => {
                  return {
                    appointment_id: appointmentId,
                    travel_id: travel
                  };
                })
              : [];

          await supabase.from('tb_appointments_travels').insert(travels);

          const referrals =
            data.referrals.length > 0
              ? data.referrals.map((e) => {
                  return {
                    destination: e.firstOptionId,
                    type: e.secondOptionId,
                    appointment_id: appointmentId
                  };
                })
              : [];

          await supabase.from('tb_appointment_referrals').insert(referrals);
        };

        saveRegister();

        toast.success('Você registrou um novo atendimento com sucesso.');

        reset();

        setCurrentStep(0);
        selectFormValidation(0);
        router.push('/');
      } catch (error) {
        toast.error(
          `Houve algum problema no cadastro de seu formulário. Erro ${error}. Tente novamente.`
        );
      }
    }
  };

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
        setError,
        setValue,
        watch
      }}
    >
      {children}
    </RegisterAppointmentContext.Provider>
  );
};

export const useRegisterAppointmentContext = () => {
  const context = useContext(RegisterAppointmentContext);
  if (context === undefined) {
    throw new Error(
      'useAppointmentClientContext deve ser usado dentro de um GlobalContextProvider'
    );
  }
  return context;
};
