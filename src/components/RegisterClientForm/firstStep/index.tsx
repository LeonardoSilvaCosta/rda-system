
import { ClientFormValues } from '@/types/types';
import styles from './styles.module.scss';
import { Control, UseFormRegister, UseFormWatch } from "react-hook-form";
import { Input } from '@/components/Input';
import { MyDatePicker } from '@/components/MyDatePicker';
import { RadioGroup } from '@/components/RadioGroup';
import { listEstadosCivis, listLocais } from '@/data';
import { MyCustomDropdown } from '@/components/MyCustomDropdown';
import { Button } from '@/components/Button';

interface FirstFormProps {
  control: Control<ClientFormValues>,
  register: UseFormRegister<ClientFormValues>,
  watch: UseFormWatch<ClientFormValues>,
}

export function RegisterClientFirstStep({ control, register }: FirstFormProps) {

  return (
    <>
      <h2><span>Cadastrar atendido</span></h2>
      <RadioGroup
        title="O atendido é militar?"
        name="eMilitar"
        label1="Sim"
        label2="Não"
        register={register}
      />
      <Input
        title="Nome completo"
        name="fullName"
        type="text"
        hint="1º TEN QCOPM RG 40897 LEONARDO DA SILVA COSTA"
        register={register}
      />
      <Input
        title="Nome de guerra"
        name="nickName"
        type="text"
        hint="LEONARDO"
        register={register}
      />
      <RadioGroup
        title="Sexo"
        name="gender"
        label1="Masculino"
        label2="Feminino"
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
      <Input
        title="RG"
        name="rg"
        type="text"
        hint="40897"
        register={register}
      />
      <Input
        title="CPF"
        name="cpf"
        type="text"
        hint="000.000.000-00"
        register={register}
      />
      <MyCustomDropdown
        title="OPM"
        fieldName="opm"
        options={listLocais}
        control={control}
      />
      <MyCustomDropdown
        title="Rank"
        fieldName="rank"
        options={listLocais}
        control={control}
      />
      <div className={styles.buttonsBox}>
        <Button
          type="submit"
        />
        <Button
          type="button"
        />
      </div>
    </>)
}