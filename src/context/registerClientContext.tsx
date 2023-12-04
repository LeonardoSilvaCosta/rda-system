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
  UseFormSetValue,
  UseFormWatch,
  useForm
} from 'react-hook-form';
import toast from 'react-hot-toast';

import { FirstClientForm } from '@/components/RegisterClientForm/FirstClientForm';
import { SecondClientForm } from '@/components/RegisterClientForm/SecondClientForm';
import { ThirdClientForm } from '@/components/RegisterClientForm/ThidClientForm';
import { ClientFormValues, PopulateFormData } from '@/types/types';
import {
  addressFormValidation,
  contactFormValidation,
  militaryFormValidation,
  firstClientFormValidations
} from '@/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import * as yup from 'yup';

interface RegisteClientContextProps {
  clearErrors: UseFormClearErrors<any>;
  control: Control<any, any>;
  currentFormType: keyof typeof firstClientFormValidations;
  errors: FieldErrors<ClientFormValues>;
  formType: string;
  clientFormData: PopulateFormData[];
  formDataRequest: () => Promise<PopulateFormData[]>;
  getValues: UseFormGetValues<any>;
  currentComponent: JSX.Element;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  handleSubmit: UseFormHandleSubmit<any, undefined>;
  isCPFValid: boolean;
  isCPFUnique: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  onSubmit: SubmitHandler<ClientFormValues>;
  register: UseFormRegister<any>;
  reset: UseFormReset<any>;
  selectFormValidation: (index: number) => void;
  setCurrentFormType: Dispatch<
    SetStateAction<'militar' | 'dependente' | 'civil-sem-vínculo'>
  >;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  setClientFormData: Dispatch<SetStateAction<PopulateFormData[]>>;
  setIsCPFValid: Dispatch<SetStateAction<boolean>>;
  setIsCPFUnique: Dispatch<SetStateAction<boolean>>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

const RegisterClientContext = createContext<
  RegisteClientContextProps | undefined
>(undefined);

export const RegisterClientContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const supabase = createClientComponentClient();
  const [clientFormData, setClientFormData] = useState<PopulateFormData[]>([]);
  const router = useRouter();
  const [validationSchema, setValidationSchema] = useState<
    yup.ObjectSchema<object>
  >(militaryFormValidation);
  const [isCPFValid, setIsCPFValid] = useState(true);
  const [isCPFUnique, setIsCPFUnique] = useState(true);

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
  } = useForm<ClientFormValues | any>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      fullName: '',
      nickName: null,
      rg: null,
      rank: null,
      cadre: null,
      gender: '',
      cpf: '',
      birthDate: null,
      maritalStatus: null,
      contacts: [
        {
          phone: '',
          ownerIdentification: '',
          bond: null,
          attended_id: ''
        }
      ],
      address: {
        zipCode: '',
        number: '',
        street: '',
        neighborhood: '',
        complement: null,
        city_id: '',
        attended_id: ''
      },
      opm: null,
      policyHolder: null,
      isCivilVolunteer: '',
      familiarBond: null,
      workStatus: null
    }
  });

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentFormType, setCurrentFormType] =
    useState<keyof typeof firstClientFormValidations>('militar');

  const scrollingTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const formDataRequest = async () => {
    const req = await fetch('/api/get_attended_form_data');
    const res = await req.json();

    setClientFormData(res);
    return res;
  };

  const formComponents = [
    <FirstClientForm
      key="first"
      formType={currentFormType}
      register={register}
      control={control}
      watch={watch}
    />,
    <SecondClientForm key="second" register={register} control={control} />,
    <ThirdClientForm key="third" register={register} control={control} />
  ];

  const returnToOptions = () => {
    reset();
    router.push('/RegisterClient/Options');
  };

  useEffect(() => {
    selectFormValidation(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFormType]);

  const totalSteps = 3;

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
      returnToOptions();
      return;
    }

    setCurrentStep(currentStep - 1);
    selectFormValidation(currentStep - 1);
  };

  const selectFormValidation = (index: number) => {
    switch (index) {
      case 0:
        setValidationSchema(firstClientFormValidations[currentFormType]);
        break;
      case 1:
        setValidationSchema(addressFormValidation);
        break;
      case 2:
        setValidationSchema(contactFormValidation);
        break;
      default:
        return null;
    }
  };

  const onSubmit: SubmitHandler<ClientFormValues> = async (data) => {
    goToNextStep();

    if (isLastStep) {
      console.log(data);
      const { data: logedUserData } = await supabase.auth.getUser();
      const userEmail = logedUserData.user?.email;
      const { data: userData } = await supabase
        .from('tb_users')
        .select()
        .eq('email', userEmail)
        .single();

      const birthDate = new Date(data.birthDate);
      const isCivilVolunteer = data.isCivilVolunteer === 'Sim' ? true : false;

      const year = birthDate.getFullYear();
      const month = birthDate.getMonth() + 1;
      const day = birthDate.getDate();

      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}`;
      const cleanedCPF = data.cpf.replace(/[^\d]/g, '');
      const cleanedZipCode = data.address.zipCode.replace(/[^\d]/g, '');

      const phones = data.contacts.map((e) => {
        return {
          phone: e.phone.replace(/[^\d]/g, ''),
          owner_identification: e.ownerIdentification,
          bond: e.bond
        };
      });

      try {
        const { error } = await supabase.rpc('create_new_attended', {
          fullname_input: data.fullName.toUpperCase(),
          nickname_input: data.nickName ? data.nickName.toUpperCase() : null,
          rg_input: data.rg,
          rank_id_input: data.rank,
          cadre_id_input: data.cadre,
          opm_id_input: data.opm,
          gender_id_input: data.gender,
          cpf_input: cleanedCPF,
          birth_date_input: formattedDate,
          marital_status_id_input: data.maritalStatus,
          policy_holder_id_input: data.policyHolder,
          is_civil_volunteer_input: isCivilVolunteer,
          familiar_bond_id_input: data.familiarBond,
          work_status_id_input: data.workStatus,
          registered_by_input: await userData.id,
          zip_code_input: cleanedZipCode,
          number_input: data.address.number,
          street_input: data.address.street,
          neighborhood_input: data.address.neighborhood,
          city_id_input: data.address.city,
          phones_input: phones
        });

        if (!error) {
          toast.success('Você cadastrou um novo atendido com sucesso.');
        } else {
          toast.error(
            `Error ao cadastrar novo atendido! Tente novamente mais tarde.`
          );
          console.log(
            `Erro no cadastro de novo atendido. ${JSON.stringify(
              error,
              null,
              2
            )}.`
          );
        }
      } catch (error) {
        toast.error(
          `Houve algum problema no cadastro de seu formulário, tente novamente.`
        );
        console.log(`Problema no cadastro de seu formulário.`);
        throw error;
      } finally {
        reset();
        setCurrentStep(0);
        selectFormValidation(0);
        router.push('/RegisterClient/Options');
      }
    }
  };

  return (
    <RegisterClientContext.Provider
      value={{
        clearErrors,
        control,
        currentComponent: formComponents[currentStep],
        currentFormType,
        errors,
        clientFormData,
        formType: 'clientRegister',
        setClientFormData,
        formDataRequest,
        getValues,
        goToNextStep,
        goToPreviousStep,
        handleSubmit,
        isCPFValid,
        isCPFUnique,
        isFirstStep,
        isLastStep,
        onSubmit,
        register,
        reset,
        setCurrentFormType,
        setCurrentStep,
        setIsCPFValid,
        setIsCPFUnique,
        selectFormValidation,
        setValue,
        watch
      }}
    >
      {children}
    </RegisterClientContext.Provider>
  );
};

export const useRegisterClientContext = () => {
  const context = useContext(RegisterClientContext);
  if (context === undefined) {
    throw new Error(
      'useRegisterClientContext deve ser usado dentro de um GlobalContextProvider'
    );
  }
  return context;
};
