import { Control, UseFormRegister, UseFormWatch } from "react-hook-form";
import { Button } from "../Button";
import { Input } from "../Input";
import { MyCustomDropdown } from "../MyCustomDropdown";
import { MyDatePicker } from "../MyDatePicker";
import { RadioGroup } from "../RadioGroup";
import { FormValues } from "@/types/types";
import { list5, list6 } from "@/data";

import styles from './styles.module.scss';

interface SecondFormProps {
  watch: UseFormWatch<FormValues>,
  register: UseFormRegister<FormValues>,
  control: Control<FormValues>,
}

export function RDASecondForm({ register, control, watch }: SecondFormProps) {
  return (
    <>
      <h2><span>Dados do militar</span></h2>
      <Input
        title="Identificação"
        name="identificacao"
        type="text"
        hint="1º TEN QCOPM RG 40897 LEONARDO DA SILVA COSTA"
        required={true}
        register={register}
      />
      <Input
        title="OPM"
        name="opm"
        type="text"
        hint="CIAP"
        required={true}
        register={register}
      />
      <RadioGroup
        title="Sexo"
        name="sexoPM"
        label1="Masculino"
        label2="Feminino"
        required={true}
        register={register}
      />
      <MyDatePicker
        title="Data de nascimento"
        name="dataDeNascimentoPM"
        required={true}
        control={control}
      />
      <MyCustomDropdown
        title="Cidade em que reside"
        fieldName="cidadeEmQueResidePM"
        options={list5}
        control={control}
      />
      <MyCustomDropdown
        title="Estado civil"
        fieldName="estadoCivilPM"
        options={list6}
        control={control}
      />
      <RadioGroup
        title="Atendimento para dependente?"
        name="eDependente"
        label1="Sim"
        label2="Não"
        required={true}
        register={register}
      />
      <div className={styles.buttonsBox}>
        <Button type="submit" name="Próxima" />
        <Button type="button" name="Cancelar" />
      </div>
    </>)
}