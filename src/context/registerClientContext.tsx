"use client"

import { ClientFormValues } from '@/types/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { Control, FieldErrors, SubmitHandler, UseFormGetValues, UseFormHandleSubmit, UseFormRegister, UseFormReset, UseFormSetValue, UseFormWatch, useForm } from 'react-hook-form';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { addressFormValidation, contactFormValidation, dependentFormValidation, militaryFormValidation, firstFormValidations } from '@/validation';
import * as yup from "yup"
import { useRouter } from 'next/navigation';
import { FirstClientForm } from '@/components/RegisterClientForm/FirstClientForm';
import { SecondClientForm } from '@/components/RegisterClientForm/SecondClientForm';
import { ThirdClientForm } from '@/components/RegisterClientForm/ThidClientForm';

interface GlobalContextProps {
  control: Control<any, any>
  currentFormType: keyof typeof firstFormValidations;
  errors: FieldErrors<ClientFormValues>,
  formType: string,
  getValues: UseFormGetValues<any>,
  currentComponent: JSX.Element,
  goToNextStep: () => void,
  goToPreviousStep: () => void,
  handleSubmit: UseFormHandleSubmit<any, undefined>,
  isFirstStep: boolean,
  isLastStep: boolean,
  onSubmit: SubmitHandler<ClientFormValues>,
  register: UseFormRegister<any>,
  reset: UseFormReset<any>,
  selectFormValidation: (index: number) => void,
  setCurrentFormType: Dispatch<SetStateAction<"militar" | "dependente" | "civil-sem-vínculo">>,
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>,
}

const RegisterClientContext = createContext<GlobalContextProps | undefined>(undefined);

export const RegisterClientContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const supabase = createClientComponentClient();
  const router = useRouter();
  const [validationSchema, setValidationSchema] = useState<yup.ObjectSchema<{}>>(militaryFormValidation);

  const {
    handleSubmit,
    register,
    watch,
    control,
    getValues,
    reset,
    setValue,
    formState: { errors }
  } = useForm<ClientFormValues | any>({
    resolver: yupResolver(validationSchema),
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
  const [currentFormType, setCurrentFormType] = useState<keyof typeof firstFormValidations>("militar");

  const scrollingTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  const formComponents = [
    <FirstClientForm formType={currentFormType} register={register} control={control} watch={watch} />,
    <SecondClientForm register={register} control={control} />,
    <ThirdClientForm register={register} control={control} />,
  ]

  const returnToOptions = () => {
    reset();
    router.push('/RegisterClient/Options')
  }

  useEffect(() => {
    selectFormValidation(0);
  }, [currentFormType])

  useEffect(() => {
    console.log(errors)
  }, [errors])

  const totalSteps = 3;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep + 1 === totalSteps;

  const goToNextStep = () => {
    if (currentStep + 1 >= totalSteps) return;
    setCurrentStep(currentStep + 1);
    selectFormValidation(currentStep + 1);

    scrollingTop();
  }

  const goToPreviousStep = () => {
    if (currentStep - 1 < 0) { returnToOptions(); return; };

    setCurrentStep(currentStep - 1);
    selectFormValidation(currentStep - 1);
  }

  const selectFormValidation = (index: number) => {
    switch (index) {
      case 0:
        setValidationSchema(firstFormValidations[currentFormType]);
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
  }

  const onSubmit: SubmitHandler<ClientFormValues> = async (data) => {
    goToNextStep();

    if (isLastStep) {
      console.log(data)
      const birthDate = new Date(data.birthDate);
      const isCivilVolunteer = data.isCivilVolunteer === "Sim" ? true : false;

      const year = birthDate.getFullYear();
      const month = birthDate.getMonth() + 1;
      const day = birthDate.getDate();

      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      try {
        const saveRegister = async () => {
          const res = await supabase.from("tb_attendeds").upsert({
            fullname: data.fullName,
            nickname: data.nickName,
            rg: data.rg,
            rank_id: data.rank,
            cadre_id: data.cadre,
            opm_id: data.opm,
            gender_id: data.gender,
            cpf: data.cpf,
            birth_date: formattedDate,
            marital_status_id: data.maritalStatus,
            registered_by: null,
            policy_holder_id: data.policyHolder,
            is_civil_volunteer: isCivilVolunteer,
            familiar_bond: data.familiarBond,
            work_status: data.workStatus,
          }).select();

          const attendedId = res.data && res.data[0].id;

          await supabase.from("tb_addresses").insert({
            zip_code: data.address.zipCode,
            number: data.address.number,
            street: data.address.street,
            neighborhood: data.address.neighborhood,
            complement: data.address.complement,
            city_id: data.address.city,
            attended_id: attendedId,
          });

          const phones = data.contacts.map((e) => {
            return {
              phone: e.phone,
              owner_identification: e.ownerIdentification,
              attended_relationship: e.attendedRelationship,
              attended_id: attendedId
            }
          })

          await supabase.from("tb_phones").insert(
            phones
          );
        }

        saveRegister();

        alert("Você cadastrou um novo usuário com sucesso.")

        reset();

        setCurrentStep(0);
        selectFormValidation(0);
        router.push("/RegisterClient/Options")
      } catch (error) {
        alert(`Houve algum problema no cadastro de seu formulário. Erro ${error}. Tente novamente.`)
      }
    }
  }

  return (
    <RegisterClientContext.Provider
      value={{
        control,
        currentComponent: formComponents[currentStep],
        currentFormType,
        errors,
        formType: 'clientRegister',
        getValues,
        goToNextStep,
        goToPreviousStep,
        handleSubmit,
        isFirstStep,
        isLastStep,
        onSubmit,
        register,
        reset,
        setCurrentFormType,
        selectFormValidation,
        setValue,
        watch,
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
