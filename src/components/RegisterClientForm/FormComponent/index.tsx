
import { ClientFormValues, Option, Rank } from '@/types/types';
import styles from './styles.module.scss';
import { Control, UseFormRegister, UseFormWatch } from "react-hook-form";
import { Input } from '@/components/Input';
import { MyDatePicker } from '@/components/MyDatePicker';
import { RadioGroup } from '@/components/RadioGroup';
import { listEstadosCivis, listLocais, listMunicipios, listRank } from '@/data';
import { MyCustomDropdown } from '@/components/MyCustomDropdown';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';
import { useRegisterClientContext } from '@/context/registerClientContext';
import { useEffect, useState } from 'react';

interface FormComponentProps {
  type: string | null;
  control: Control<ClientFormValues>,
  register: UseFormRegister<ClientFormValues>,
  watch: UseFormWatch<ClientFormValues>,
}

export function FormComponent({ type, control, register }: FormComponentProps) {
  const { errors, getValues, reset } = useRegisterClientContext();
  const router = useRouter();
  const [ ranks, setRanks ] = useState<Option[]>([]);
  const [ cadres, setCadres ] = useState<Option[]>([]);
  const [ genders, setGenders ] = useState<Option[]>([]);
  const [ maritalStatus, setMaritalStatus ] = useState<Option[]>([]);
  const [ units, setUnits ] = useState<Option[]>([]);
  const [ cities, setCities ] = useState<Option[]>([]);
  const isMilitary = type === "militar";
  const isDependent = type === "dependente";
  const isCivilian = type === "civil-sem-vínculo"

  const returnToDashboard = () => {
    reset();
    router.push('/RegisterClient/Options')
  }

  useEffect(() => {
    const getLists = async () => {
      try {
        const resRanks = await fetch('/api/get_ranks');
        const resCadres = await fetch('/api/get_cadres');
        const resGenders = await fetch('/api/get_genders');
        const resMaritalStatus = await fetch('/api/get_marital_status');
        const resUnits = await fetch('/api/get_units');
        const resCities = await fetch('/api/get_cities');
        const ranks = await resRanks.json();
        const cadres = await resCadres.json();
        const genders = await resGenders.json();
        const maritalStatus = await resMaritalStatus.json();
        const units = await resUnits.json();
        const cities = await resCities.json();


        setRanks(ranks);
        setCadres(cadres);
        setGenders(genders);
        setMaritalStatus(maritalStatus);
        setUnits(units);
   
        setCities(cities);
      } catch(error) {
        console.log(error)
      }
    }

    getLists();
  }, [])

  return (
    <>
      <Input
        title="Nome completo"
        name="fullName"
        type="text"
        hint="LEONARDO DA SILVA COSTA"
        errors={errors}
        register={register}
      />
      {
        isDependent && (
          <MyCustomDropdown
            title="Titular"
            fieldName="policyHolder"
            options={ranks}
            getValues={getValues}
            errors={errors}
            control={control}
          />
        )
      }
      {
        isMilitary && (
          <>
            <Input
              title="Nome de guerra"
              name="nickName"
              type="text"
              hint="LEONARDO"
              errors={errors}
              register={register}
            />
            <Input
              title="RG"
              name="rg"
              type="text"
              hint="40897"
              errors={errors}
              register={register}
            />
            <MyCustomDropdown
              title="Posto/graduação"
              fieldName="rank"
              options={ranks}
              getValues={getValues}
              errors={errors}
              control={control}
            />
            <MyCustomDropdown
              title="Quadro"
              fieldName="cadre"
              options={cadres}
              getValues={getValues}
              errors={errors}
              control={control}
            />
            <MyCustomDropdown
              title="OPM"
              fieldName="opm"
              options={units}
              getValues={getValues}
              errors={errors}
              control={control}
            />
          </>)
      }
      <RadioGroup
        title="Sexo"
        name="gender"
        options={genders}
        errors={errors}
        register={register}
      />
      <Input
        title="CPF"
        name="cpf"
        type="text"
        hint="000.000.000-00"
        errors={errors}
        register={register}
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
      />
      <MyCustomDropdown
        title="Cidade de residência"
        fieldName="cityOfResidence"
        options={listMunicipios}
        getValues={getValues}
        errors={errors}
        control={control}
      />
      {
        isCivilian && (
          <RadioGroup
            title="É voluntário civil"
            name="isCivilVolunteer"
            label1="Sim"
            label2="Não"
            errors={errors}
            register={register}
          />
        )
      }
      <div className={styles.buttonsBox}>
        <Button
          type="submit"
          name="Enviar"
        />
        <Button
          type="button"
          name="Voltar"
          onClick={returnToDashboard}
        />
      </div>
    </>)
}