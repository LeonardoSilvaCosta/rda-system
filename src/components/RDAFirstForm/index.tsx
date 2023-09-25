import { Button } from "../Button";
import { Input } from "../Input";
import { MyCustomDropdown } from "../MyCustomDropdown";
import { MyDatePicker } from "../MyDatePicker";
import { RadioGroup } from "../RadioGroup";
import { FormValues } from "@/types/types";
import { listAcessos, listLocais, listOficiais, listRecepcionistas } from "@/data";

import styles from './styles.module.scss';
import { Control, UseFormRegister, UseFormWatch, useForm } from "react-hook-form";

interface FirstFormProps {
  watch: UseFormWatch<FormValues>,
  register: UseFormRegister<FormValues>,
  control: Control<FormValues>,
}

export function RDAFirstForm({ watch, register, control }: FirstFormProps) {
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
        options={listRecepcionistas}
        control={control}
      />
      <MyCustomDropdown
        title="Oficial"
        fieldName="oficial"
        options={listOficiais}
        control={control}
      />
      <MyCustomDropdown
        title="Acesso"
        fieldName="acesso"
        options={listAcessos}
        control={control}
      />
      <MyCustomDropdown
        title="Local"
        fieldName="local"
        options={listLocais}
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
        <Button
          type="submit"
        />
        <Button
          type="button"
        />
      </div>
    </>)
}