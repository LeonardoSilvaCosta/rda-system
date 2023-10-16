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
import { useRegisterClientContext } from '@/context/registerClientContext';
import { ClientFormValues, Military, Option } from '@/types/types';
import { validateCPF } from '@/validation/validateCPF';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface FirstClientFormProps {
  formType: string | null;
  control: Control<ClientFormValues>;
  register: UseFormRegister<ClientFormValues>;
  watch: UseFormWatch<ClientFormValues>;
}

export function FirstClientForm({
  formType,
  control,
  register
}: FirstClientFormProps) {
  const supabase = createClientComponentClient();
  const {
    errors,
    getValues,
    goToPreviousStep,
    isCPFValid,
    isCPFUnique,
    setIsCPFValid,
    setIsCPFUnique
  } = useRegisterClientContext();
  const [isLoading, setIsLoading] = useState(true);
  const [ranks, setRanks] = useState<Option[]>([]);
  const [cadres, setCadres] = useState<Option[]>([]);
  const [genders, setGenders] = useState<Option[]>([]);
  const [maritalStatus, setMaritalStatus] = useState<Option[]>([]);
  const [opms, setOpms] = useState<Option[]>([]);
  const [militaryAttendeds, setMilitaryAttendeds] = useState<Option[]>([]);
  const [workStatus, setWorkStatus] = useState<Option[]>([]);
  const [familiarBonds, setFamiliarBonds] = useState<Option[]>([]);

  const civilVolunteerOptions = [
    { id: 'Sim', name: 'Sim' },
    { id: 'Não', name: 'Não' }
  ];

  if (!formType) return;

  const isMilitary = formType === 'militar';
  const isDependent = formType === 'dependente';
  const isCivilian = formType === 'civil-sem-vínculo';

  useEffect(() => {
    const getLists = async () => {
      try {
        const resGenders = await fetch('/api/get_genders');
        const resMaritalStatus = await fetch('/api/get_marital_status');
        const genders = await resGenders.json();
        const maritalStatus = await resMaritalStatus.json();

        setMaritalStatus(maritalStatus);
        setGenders(genders);

        if (isMilitary) {
          const resRanks = await fetch('/api/get_ranks');
          const resCadres = await fetch('/api/get_cadres');
          const resOpms = await fetch('/api/get_opms');
          const resWorkStatus = await fetch('/api/get_work_status');

          const ranks = await resRanks.json();
          const cadres = await resCadres.json();
          const opms = await resOpms.json();
          const workStatus = await resWorkStatus.json();

          setRanks(ranks);
          setCadres(cadres);
          setOpms(opms);
          setWorkStatus(workStatus);
        }

        if (isDependent) {
          const resMilitaryAttendeds = await fetch(
            '/api/get_military_attendeds'
          );
          const resFamiliarBonds = await fetch('/api/get_familiar_bonds');

          const militaryAttendeds = await resMilitaryAttendeds.json();
          const familiarBonds = await resFamiliarBonds.json();

          setFamiliarBonds(familiarBonds);
          const formatedMilitaryAttendeds = await militaryAttendeds.map(
            (e: Military) => {
              return {
                id: e.id,
                name: `${e.rank} ${e.cadre} RG ${e.rg} ${e.nickname}`
              };
            }
          );

          setMilitaryAttendeds(formatedMilitaryAttendeds);
        }

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    getLists();
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
      const { data: attendedExists } = await supabase
        .from('tb_attendeds')
        .select()
        .eq('cpf', cpf.replace(/[^\d]/g, ''));

      if (cpf && attendedExists?.length !== 0) {
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
          {isDependent && (
            <>
              <MyCustomDropdown
                title="Titular*"
                fieldName="policyHolder"
                options={militaryAttendeds}
                getValues={getValues}
                errors={errors}
                control={control}
                routeToSearch={'/api/get_military_attendeds'}
              />
              <MyCustomDropdown
                title="Vínculo*"
                fieldName="familiarBond"
                options={familiarBonds}
                getValues={getValues}
                errors={errors}
                control={control}
                routeToSearch={'/api/get_familiar_bonds'}
              />
            </>
          )}
          {isMilitary && (
            <>
              <Input
                title="Nome de guerra*"
                name="nickName"
                type="text"
                hint="LEONARDO"
                errors={errors}
                register={register}
              />
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
          )}
          <RadioGroup
            title="Sexo*"
            name="gender"
            options={genders}
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
          {(isDependent || isCivilian) && (
            <RadioGroup
              title="É voluntário civil"
              name="isCivilVolunteer"
              options={civilVolunteerOptions}
              errors={errors}
              register={register}
            />
          )}
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
