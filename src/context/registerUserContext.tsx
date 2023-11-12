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

import { FifthUserForm } from '@/components/RegisterUserForm/FifthUserForm';
import { FirstUserForm } from '@/components/RegisterUserForm/FirstUserForm';
import { FourthUserForm } from '@/components/RegisterUserForm/FourthUserForm';
import { SecondUserForm } from '@/components/RegisterUserForm/SecondUserForm';
import { ThirdUserForm } from '@/components/RegisterUserForm/ThirdUserForm';
import { PopulateFormData, UserFormValues } from '@/types/types';
import { generateRandomPassword } from '@/utils/generateRandomPassword';
import { hashPassword } from '@/utils/hashPassword';
import {
  addressFormValidation,
  contactFormValidation,
  firstClientFormValidations,
  firstUserFormValidation,
  secondUserFormValidation
} from '@/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import * as yup from 'yup';

interface RegisteUserContextProps {
  clearErrors: UseFormClearErrors<any>;
  control: Control<any, any>;
  errors: FieldErrors<UserFormValues>;
  userFormData: PopulateFormData[];
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
  isSubmitted: boolean;
  onSubmit: SubmitHandler<UserFormValues>;
  register: UseFormRegister<any>;
  reset: UseFormReset<any>;
  selectFormValidation: (index: number) => void;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  setUserFormData: Dispatch<SetStateAction<PopulateFormData[]>>;
  setIsCPFValid: Dispatch<SetStateAction<boolean>>;
  setIsCPFUnique: Dispatch<SetStateAction<boolean>>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

const RegisterUserContext = createContext<RegisteUserContextProps | undefined>(
  undefined
);

export const RegisterUserContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const supabase = createClientComponentClient();
  const [userFormData, setUserFormData] = useState<PopulateFormData[]>([]);
  const router = useRouter();
  const [validationSchema, setValidationSchema] = useState<
    yup.ObjectSchema<object>
  >(firstUserFormValidation);
  const [isCPFValid, setIsCPFValid] = useState(true);
  const [isCPFUnique, setIsCPFUnique] = useState(true);

  const {
    clearErrors,
    control,
    formState: { errors, isSubmitted },
    getValues,
    handleSubmit,
    register,
    reset,
    setValue,
    watch
  } = useForm<UserFormValues | any>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      fullName: '',
      nickName: null,
      rg: null,
      rank: null,
      cadre: null,
      gender: '',
      email: '',
      cpf: '',
      professionalRegistration: '',
      birthDate: null,
      maritalStatus: null,
      contacts: [
        {
          phone: '',
          ownerIdentification: '',
          attendedRelationship: null,
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
      isMilitary: '',
      workStatus: null
    },
    delayError: 3000
  });

  const [currentStep, setCurrentStep] = useState<number>(0);
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

    setUserFormData(res);
    return res;
  };

  const formComponents = [
    <FirstUserForm key="first" register={register} control={control} />,
    <SecondUserForm
      key="second"
      register={register}
      control={control}
      watch={watch}
    />,
    <ThirdUserForm key="third" register={register} control={control} />,
    <FourthUserForm key="fourth" register={register} control={control} />,
    <FifthUserForm key="fifth" />
  ];

  const returnToOptions = () => {
    router.push('/');
  };

  useEffect(() => {
    selectFormValidation(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSteps = 5;

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
        setValidationSchema(firstUserFormValidation);
        break;
      case 1:
        setValidationSchema(secondUserFormValidation);
        break;
      case 2:
        setValidationSchema(addressFormValidation);
        break;
      case 3:
        setValidationSchema(contactFormValidation);
        break;
      default:
        return null;
    }
  };

  const onSubmit: SubmitHandler<UserFormValues> = async (data) => {
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
          bond: null
        };
      });

      try {
        const formData = new FormData();
        const file = data.avatar[0];
        formData.append('avatar', file);
        const filename = file.name;

        const resAvatar = await fetch(
          `/api/upload_user_avatar?cpf=${cleanedCPF}&filename=${filename}`,
          {
            method: 'POST',
            body: formData
          }
        );
        const avatarData = await resAvatar.json();
        resAvatar.status !== 200 && console.log(avatarData);

        const signedUpRes = await fetch('/api/create_supabase_user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: data.email })
        });

        const signedUpData = await signedUpRes.json();

        const { error } = await supabase.rpc('create_new_user', {
          user_id_input: signedUpData.user.id,
          avatar_input: avatarData,
          fullname_input: data.fullName,
          nickname_input: data.nickName,
          rg_input: data.rg,
          rank_id_input: data.rank,
          cadre_id_input: data.cadre,
          opm_id_input: data.opm,
          gender_id_input: data.gender,
          email_input: data.email,
          cpf_input: cleanedCPF,
          professional_registration_input: data.professionalRegistration,
          birth_date_input: formattedDate,
          marital_status_id_input: data.maritalStatus,
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
          toast.success('Você cadastrou um novo usuário com sucesso.');
        } else {
          toast.error(
            `Error ao cadastrar novo usuário! Tente novamente mais tarde.`
          );
          console.log(
            `Erro no cadastro de novo usuário. ${JSON.stringify(
              error,
              null,
              2
            )}.`
          );
          if (signedUpData.user) {
            await fetch(
              `/api/delete_supabase_user?use_id=${signedUpData.user.id}`,
              {
                method: 'DELETE'
              }
            );
          }
        }
      } catch (error) {
        toast.error(
          `Houve algum problema no cadastro de seu formulário, tente novamente. ${error}`
        );
        console.log(`Problema no cadastro de seu formulário. ${error}`);
      } finally {
        reset();
        setCurrentStep(0);
        selectFormValidation(0);
        router.push('/');
      }
    }
  };

  return (
    <RegisterUserContext.Provider
      value={{
        clearErrors,
        control,
        currentComponent: formComponents[currentStep],
        errors,
        userFormData,
        formDataRequest,
        getValues,
        goToNextStep,
        goToPreviousStep,
        handleSubmit,
        isCPFValid,
        isCPFUnique,
        isFirstStep,
        isLastStep,
        isSubmitted,
        onSubmit,
        register,
        reset,
        setCurrentStep,
        setIsCPFValid,
        setIsCPFUnique,
        selectFormValidation,
        setUserFormData,
        setValue,
        watch
      }}
    >
      {children}
    </RegisterUserContext.Provider>
  );
};

export const useRegisterUserContext = () => {
  const context = useContext(RegisterUserContext);
  if (context === undefined) {
    throw new Error(
      'useRegisterUserContext deve ser usado dentro de um GlobalContextProvider'
    );
  }
  return context;
};
