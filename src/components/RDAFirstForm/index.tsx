import { Control, UseFormRegister, UseFormWatch } from "react-hook-form";
import { Button } from "../Button";
import { Input } from "../Input";
import { MyCustomDropdown } from "../MyCustomDropdown";
import { MyDatePicker } from "../MyDatePicker";
import { RadioGroup } from "../RadioGroup";
import { FormValues } from "@/types/types";
import { list1, list2, list3, list4 } from "@/data";

import styles from './styles.module.scss';

interface FirstFormProps {
  watch: UseFormWatch<FormValues>,
  register: UseFormRegister<FormValues>,
  control: Control<FormValues>,
}

export function RDAFirstForm({ register, control, watch }: FirstFormProps) {
  const watchTemProtocolo = watch("temProtocolo");

  return (
    <>
      <h2><span>Dados gerais</span></h2>
      <MyDatePicker
        title="Data"
        name="data"
        required={true}
        control={control}
      />
      <Input
        title="Horário"
        name="horario"
        type="time"
        hint="11:00"
        required={true}
        register={register}
      />
      <MyCustomDropdown
        title="Recepcionista"
        fieldName="recepcionista"
        options={list1}
        control={control}
      />
      <MyCustomDropdown
        title="Oficial"
        fieldName="oficial"
        options={list2}
        control={control}
      />
      <MyCustomDropdown
        title="Acesso"
        fieldName="acesso"
        options={list3}
        control={control}
      />
      <MyCustomDropdown
        title="Local"
        fieldName="local"
        options={list4}
        control={control}
      />
      <RadioGroup
        title="Modalidade de atendimento"
        name="modalidade"
        label1="Presencial"
        label2="Remota"
        required={true}
        register={register}
      />
      <RadioGroup
        title="Tem protocolo/PAE?"
        name="temProtocolo"
        label1="Sim"
        label2="Não"
        required={true}
        register={register}
      />
      {
        String(watchTemProtocolo) === "Sim" ? (
          <Input
            title="Protocolo"
            name="protocolo"
            type="text"
            hint="123/2023"
            required={false}
            register={register}
          />
        ) : <></>
      }
      <div className={styles.buttonsBox}>
        <Button type="submit" name="Próxima" />
        <Button type="button" name="Cancelar" />
      </div>
    </>)
}