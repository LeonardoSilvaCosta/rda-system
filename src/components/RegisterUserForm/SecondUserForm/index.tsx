import { useEffect, useState } from 'react';
import { Control, UseFormRegister, UseFormWatch } from 'react-hook-form';

import styles from './styles.module.scss';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { LoadingComponent } from '@/components/Loading/loading';
import { MaskedInput } from '@/components/MaskedInput';
import { MyCustomDropdown } from '@/components/MyCustomDropdown';
import { MyDatePicker } from '@/components/MyDatePicker';
import { RadioGroup } from '@/components/RadioGroup';
import { useRegisterUserContext } from '@/context/registerUserContext';
import { UserFormValues } from '@/types/types';
import { validateCPF } from '@/validation/validateCPF';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface SecondUserFormProps {
  control: Control<UserFormValues>;
  register: UseFormRegister<UserFormValues>;
  watch: UseFormWatch<UserFormValues>;
}

export function SecondUserForm({
  control,
  register,
  watch
}: SecondUserFormProps) {
  const supabase = createClientComponentClient();
  const {
    errors,
    getValues,
    goToPreviousStep,
    isCPFValid,
    isCPFUnique,
    setIsCPFValid,
    setIsCPFUnique,
    userFormData
  } = useRegisterUserContext();
  const isMilitary = getValues('isMilitary') === 'Sim' ? true : false;
  const watchCadre = watch('cadre');
  const QCOPMId = 'df4281a9-d27f-42b8-baf9-fcf9d58d055e';

  const [isLoading, setIsLoading] = useState(true);
  const ranks = userFormData
    .filter((e) => e.source === 'Rank')
    .map((rank) => {
      return {
        id: rank.id,
        name: rank.name
      };
    });
  const cadres = userFormData
    .filter((e) => e.source === 'Cadre')
    .map((cadre) => {
      return {
        id: cadre.id,
        name: cadre.name
      };
    });
  const genders = userFormData
    .filter((e) => e.source === 'Gender')
    .map((gender) => {
      return {
        id: gender.id,
        name: gender.name
      };
    });
  const maritalStatus = userFormData
    .filter((e) => e.source === 'Marital status')
    .map((maritalStatus) => {
      return {
        id: maritalStatus.id,
        name: maritalStatus.name
      };
    });
  const opms = userFormData
    .filter((e) => e.source === 'OPM')
    .map((opm) => {
      return {
        id: opm.id,
        name: opm.name
      };
    });
  const workStatus = userFormData
    .filter((e) => e.source === 'Work status')
    .map((workStatus) => {
      return {
        id: workStatus.id,
        name: workStatus.name
      };
    });

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const analyseCPF = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const field = e.target;
    const cpf = field.value;

    if (cpf && !validateCPF(cpf)) {
      field.focus();
      setIsCPFValid(false);
    } else {
      setIsCPFValid(true);
    }

    try {
      const { data: userExists } = await supabase
        .from('tb_users')
        .select()
        .eq('cpf', cpf.replace(/[^\d]/g, ''));

      if (cpf && userExists?.length !== 0) {
        field.focus();
        setIsCPFUnique(false);
      } else {
        setIsCPFUnique(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <>
          <Input
            title="Nome completo*"
            name="fullName"
            type="text"
            hint="LEONARDO DA SILVA COSTA"
            errors={errors}
            register={register}
          />
          <>
            <Input
              title="Nome de guerra*"
              name="nickName"
              type="text"
              hint="LEONARDO"
              errors={errors}
              register={register}
            />
            {isMilitary && (
              <>
                <Input
                  title="RG*"
                  name="rg"
                  type="text"
                  hint="40897"
                  errors={errors}
                  register={register}
                />
                <MyCustomDropdown
                  title="Posto/graduação*"
                  fieldName="rank"
                  options={ranks}
                  getValues={getValues}
                  errors={errors}
                  control={control}
                  routeToSearch={'/api/get_ranks'}
                />
              </>
            )}
            <MyCustomDropdown
              title="Quadro*"
              fieldName="cadre"
              options={cadres}
              getValues={getValues}
              errors={errors}
              control={control}
              routeToSearch={'/api/get_cadres'}
            />
            <MyCustomDropdown
              title="OPM*"
              fieldName="opm"
              options={opms}
              getValues={getValues}
              errors={errors}
              control={control}
              routeToSearch={'/api/get_opms'}
            />
            <MyCustomDropdown
              title="Situação funcional*"
              fieldName="workStatus"
              options={workStatus}
              getValues={getValues}
              errors={errors}
              control={control}
              routeToSearch={'/api/get_work_status'}
            />
          </>
          <RadioGroup
            title="Sexo*"
            name="gender"
            options={genders}
            errors={errors}
            register={register}
          />
          <Input
            title="Email*"
            name="email"
            type="email"
            hint="leonardopmpa@gmail.com"
            errors={errors}
            register={register}
          />
          <MaskedInput
            title="CPF*"
            name="cpf"
            type="text"
            hint="000.000.000-00"
            errors={errors}
            register={register}
            mask={'999.999.999-99'}
            onBlur={(e) => analyseCPF(e)}
          />
          {watchCadre === QCOPMId && (
            <Input
              title="Registro profissional*"
              name="professionalRegistration"
              type="text"
              hint="10/05495"
              errors={errors}
              register={register}
            />
          )}
          <MyDatePicker
            title="Data de nascimento"
            name="birthDate"
            errors={errors}
            control={control}
          />
          <MyCustomDropdown
            title="Estado civil"
            fieldName="maritalStatus"
            options={maritalStatus}
            getValues={getValues}
            errors={errors}
            control={control}
            routeToSearch={'/api/get_marital_status'}
          />
          <div className={styles.buttonsBox}>
            <Button type="button" name="Voltar" onClick={goToPreviousStep} />
            <Button
              type={'submit'}
              name="Próxima"
              disabled={!isCPFValid || !isCPFUnique}
            />
          </div>
        </>
      )}
    </>
  );
}
