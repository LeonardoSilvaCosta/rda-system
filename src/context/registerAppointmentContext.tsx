/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRouter } from 'next/navigation';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
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

import { FirstAppointmentForm } from '@/components/RegisterAppointmentForm/FirstAppointmentForm';
import { SecondAppointmentForm } from '@/components/RegisterAppointmentForm/SecondAppointmentForm';
import { AppointmentFormValues, PopulateFormData } from '@/types/types';
import {
  firstAppointmentStepValidation,
  secondAppointmentStepValidation
} from '@/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import * as yup from 'yup';

interface RegisterAppointmentContextProps {
  appointmentFormData: PopulateFormData[];
  clearErrors: UseFormClearErrors<any>;
  control: Control<any, any>;
  errors: FieldErrors<AppointmentFormValues>;
  getValues: UseFormGetValues<any>;
  formDataRequest: () => Promise<PopulateFormData[]>;
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
  const supabase = createClientComponentClient();
  const [appointmentFormData, setAppointmentFormData] = useState<
    PopulateFormData[]
  >([]);

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
      date: null,
      time: null,
      specialists: [],
      attendeds: [],
      access: '',
      facility: '',
      modality: '',
      hasProgram: '',
      program: null,
      hasProtocol: '',
      protocol: null,
      service: '',
      psychologicalAssessment: null,
      socialAssessment: null,
      generalDemand: '',
      specificDemands: [],
      procedure: '',
      employmentStatus: null,
      hasFirstOptionWithoutSecondOption: false,
      referrals: [],
      producedDocuments: [],
      travels: [],
      hasLeaveOfAbsence: '',
      hospitalization: '',
      recordProgress: ''
    }
  });

  const returnToDashboard = () => {
    reset();
    router.push('/');
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const [currentStep, setCurrentStep] = useState<number>(0);

  const scrollingTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const formDataRequest = async () => {
    const req = await fetch('/api/get_appointment_form_data');
    const res = await req.json();

    setAppointmentFormData(res);
    return res;
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

        const hasLeaveOfAbsence = data.hasLeaveOfAbsence === 'S' ? true : false;

        const hospitalization = data.hospitalization === '1' ? true : false;

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

        const formattedProtocol =
          typeof data.protocol === 'undefined' ? null : data.protocol;

        const referrals =
          data.referrals.length > 0
            ? data.referrals.map((e) => {
                return {
                  destination: e.firstOptionId,
                  type: e.secondOptionId
                };
              })
            : [];

        const { error } = await supabase.rpc('create_new_appointment', {
          access_id_input: data.access,
          attendeds_id_input: data.attendeds,
          date_input: formattedDate,
          documents_id_input: data.producedDocuments,
          employment_status_id_input: data.employmentStatus,
          facility_id_input: data.facility,
          general_demand_id_input: data.generalDemand,
          has_leave_of_absence_input: hasLeaveOfAbsence,
          hospitalization_input: hospitalization,
          modality_id_input: data.modality,
          procedure_id_input: data.procedure,
          program_id_input: data.program,
          protocol_input: formattedProtocol,
          psychological_assessment_id_input: data.psychologicalAssessment,
          record_progress_input: data.recordProgress,
          referrals_input: referrals,
          registered_by_input: await userData.id,
          service_id_input: data.service,
          social_assessment_id_input: data.socialAssessment,
          specialists_id_input: data.specialists,
          specific_demands_id_input: data.specificDemands,
          time_input: formattedHour,
          travels_id_input: data.travels
        });

        if (!error) {
          toast.success('Você registrou um novo atendimento com sucesso!');
        } else {
          toast.error(
            `Error ao registrar novo atendimento! Tente novamente mais tarde.`
          );
          console.log(
            `Erro ao registrar novo atendimento. ${JSON.stringify(
              error,
              null,
              2
            )}.`
          );
        }
      } catch (error) {
        toast.error(
          `Error no cadastro de seu formulário. Tente novamente mais tarde.`
        );
        console.log(
          `Problema no cadastro de seu formulário. Erro ${JSON.stringify(
            error,
            null,
            2
          )}.`
        );
      } finally {
        router.push('/');
        reset();
        setCurrentStep(0);
        selectFormValidation(0);
      }
    }
  };

  return (
    <RegisterAppointmentContext.Provider
      value={{
        appointmentFormData,
        clearErrors,
        control,
        currentComponent: formComponents[currentStep],
        errors,
        formDataRequest,
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
