
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

interface FormComponentProps {
  type: string | null;
  control: Control<ClientFormValues>,
  register: UseFormRegister<ClientFormValues>,
  watch: UseFormWatch<ClientFormValues>,
}

export function FormComponent({ type, control, register }: FormComponentProps) {
  const router = useRouter();
  const isMilitary = type === "militar";
  const isDependent = type === "dependente";
  const isCivilian = type === "civil-sem-vínculo"

  const returnToDashboard = () => {
    router.push('/RegisterClient/Options')
  }

  return (
    <>
      <Input
        title="Nome completo"
        name="fullName"
        type="text"
        hint="LEONARDO DA SILVA COSTA"
        register={register}
      />
      {
        isDependent && (
          <MyCustomDropdown
            title="Titular"
            fieldName="policyHolder"
            options={listRank}
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
              register={register}
            />
            <Input
              title="RG"
              name="rg"
              type="text"
              hint="40897"
              register={register}
            />
            <MyCustomDropdown
              title="Posto/graduação"
              fieldName="rank"
              options={listRank}
              control={control}
            />
            <MyCustomDropdown
              title="Quadro"
              fieldName="cadre"
              options={listCadre}
              control={control}
            />
            <MyCustomDropdown
              title="OPM"
              fieldName="opm"
              options={listLocais}
              control={control}
            />
          </>)
      }
      <RadioGroup
        title="Sexo"
        name="gender"
        label1="Masculino"
        label2="Feminino"
        register={register}
      />
      <Input
        title="CPF"
        name="cpf"
        type="text"
        hint="000.000.000-00"
        register={register}
      />
      <MyDatePicker
        title="Data de nascimento"
        name="birthDate"
        control={control}
      />
      <MyCustomDropdown
        title="Estado civil"
        fieldName="maritalStatus"
        options={listEstadosCivis}
        control={control}
      />
      <MyCustomDropdown
        title="Cidade de residência"
        fieldName="cityOfResidence"
        options={listMunicipios}
        control={control}
      />
      {
        isCivilian && (
          <RadioGroup
            title="É voluntário civil"
            name="isVoluntario"
            label1="Sim"
            label2="Não"
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