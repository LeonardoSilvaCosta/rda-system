import { Button } from "../Button";
import { Input } from "../Input";
import { MyCustomDropdown } from "../MyCustomDropdown";
import { MyDatePicker } from "../MyDatePicker";
import { RadioGroup } from "../RadioGroup";
import { FormValues } from "@/types/types";
import { listEstadosCivis, listMunicipios } from "@/data";

import styles from './styles.module.scss';
import { Control, UseFormRegister, useForm } from "react-hook-form";

interface ThirdFormProps {
  register: UseFormRegister<FormValues>,
  control: Control<FormValues>,
}

export function RDAThirdForm({ register, control }: ThirdFormProps) {

  return (
    <>
      <h2><span>Dados do dependente</span></h2>
      <Input
        title="Identificação"
        name="identificacaoDependente"
        type="text"
        hint="João Moutinho da Costa"
        required={true}
        register={register}
      />
      <RadioGroup
        title="Sexo"
        name="sexoDependente"
        label1="Masculino"
        label2="Feminino"
        required={true}
        register={register}
      />
      <MyDatePicker
        title="Data de nascimento"
        name="dataDeNascimentoDependente"
        required={true}
        control={control}
      />
      <MyCustomDropdown
        title="Cidade em que reside"
        fieldName="cidadeEmQueResideDependente"
        options={listMunicipios}
        control={control}
      />
      <MyCustomDropdown
        title="Estado civil"
        fieldName="estadoCivilDependente"
        options={listEstadosCivis}
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