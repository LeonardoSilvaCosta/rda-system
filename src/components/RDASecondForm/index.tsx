import { Button } from "../Button";
import { Input } from "../Input";
import { MyCustomDropdown } from "../MyCustomDropdown";
import { MyDatePicker } from "../MyDatePicker";
import { RadioGroup } from "../RadioGroup";
import { FormValues } from "@/types/types";
import { listEstadosCivis, listMunicipios } from "@/data";

import styles from './styles.module.scss';
import { Control, UseFormRegister } from "react-hook-form";

interface SecondFormProps {
  register: UseFormRegister<FormValues>,
  control: Control<FormValues>,
}

export function RDASecondForm({ register, control }: SecondFormProps) {
  // const { register, control } = useForm<FormValues>()

  return (
    <>
      <h2><span>Dados do militar</span></h2>
      <Input
        title="Identificação"
        name="identificacaoPM"
        type="text"
        hint="1º TEN QCOPM RG 40897 LEONARDO DA SILVA COSTA"
        register={register}
      />
      <Input
        title="OPM"
        name="opm"
        type="text"
        hint="CIAP"
        register={register}
      />
      <RadioGroup
        title="Sexo"
        name="sexoPM"
        label1="Masculino"
        label2="Feminino"
        register={register}
      />
      <MyDatePicker
        title="Data de nascimento"
        name="dataDeNascimentoPM"
        control={control}
      />
      <MyCustomDropdown
        title="Cidade em que reside"
        fieldName="cidadeEmQueResidePM"
        options={listMunicipios}
        control={control}
      />
      <MyCustomDropdown
        title="Estado civil"
        fieldName="estadoCivilPM"
        options={listEstadosCivis}
        control={control}
      />
      <RadioGroup
        title="Atendimento para dependente?"
        name="eDependente"
        label1="Sim"
        label2="Não"
        register={register}
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