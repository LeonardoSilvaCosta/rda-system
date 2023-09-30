
import { ClientFormValues } from '@/types/types';
import styles from './styles.module.scss';
import { Control, UseFormRegister, UseFormWatch } from "react-hook-form";
import { Input } from '@/components/Input';
import { MyDatePicker } from '@/components/MyDatePicker';
import { RadioGroup } from '@/components/RadioGroup';
import { listCadre, listEstadosCivis, listLocais, listMunicipios, listRank } from '@/data';
import { MyCustomDropdown } from '@/components/MyCustomDropdown';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';
import { useRegisterClientContext } from '@/context/registerClientContext';

interface FormComponentProps {
  type: string | null;
  control: Control<ClientFormValues>,
  register: UseFormRegister<ClientFormValues>,
  watch: UseFormWatch<ClientFormValues>,
}

export function FormComponent({ type, control, register }: FormComponentProps) {
  const { errors, getValues, reset } = useRegisterClientContext();
  const router = useRouter();
  const isMilitary = type === "militar";
  const isDependent = type === "dependente";
  const isCivilian = type === "civil-sem-vínculo"

  const returnToDashboard = () => {
    reset();
    router.push('/RegisterClient/Options')
  }

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
            options={listRank}
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
              options={listRank}
              getValues={getValues}
              errors={errors}
              control={control}
            />
            <MyCustomDropdown
              title="Quadro"
              fieldName="cadre"
              options={listCadre}
              getValues={getValues}
              errors={errors}
              control={control}
            />
            <MyCustomDropdown
              title="OPM"
              fieldName="opm"
              options={listLocais}
              getValues={getValues}
              errors={errors}
              control={control}
            />
          </>)
      }
      <RadioGroup
        title="Sexo"
        name="gender"
        label1="Masculino"
        label2="Feminino"
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
        options={listEstadosCivis}
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