import { Control, UseFormRegister, UseFormWatch } from "react-hook-form";
import { Button } from "../Button";
import { Input } from "../Input";
import { MyCustomDropdown } from "../MyCustomDropdown";
import { MyDatePicker } from "../MyDatePicker";
import { RadioGroup } from "../RadioGroup";
import { FormValues } from "@/types/types";
import { list5, list6 } from "@/data";

import styles from './styles.module.scss';

interface ThirdFormProps {
  watch: UseFormWatch<FormValues>,
  register: UseFormRegister<FormValues>,
  control: Control<FormValues>,
}

export function RDAThirdForm({ register, control, watch }: ThirdFormProps) {
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
        options={list5}
        control={control}
      />
      <MyCustomDropdown
        title="Estado civil"
        fieldName="estadoCivilDependente"
        options={list6}
        control={control}
      />
      <div className={styles.buttonsBox}>
        <Button type="submit" name="Próxima" />
        <Button type="button" name="Cancelar" />
      </div>
    </>)
}