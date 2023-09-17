"use client"
import { Header } from "@/components/Header";
import { Input } from "@/components/Input";

import styles from './styles.module.scss';
import { Button } from "@/components/Button";

import { MyDatePicker } from "@/components/MyDatePicker";
import { RadioGroup } from "@/components/RadioGroup";

import { useForm, SubmitHandler } from "react-hook-form";
import { FormValues } from "@/types/types";
import { MyCustomDropdown } from "@/components/MyCustomDropdown";

export default function Home() {
  const {
    register,
    handleSubmit,
    control
  } = useForm<FormValues>()

  const onSubmit: SubmitHandler<FormValues> = (data: any) => console.log(data)

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2><span>Dados gerais</span></h2>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
            text="Recepcionista"
          />
          <MyCustomDropdown
            title="oficial"
            text="Oficial"
          />
          <MyCustomDropdown
            title="acesso"
            text="Acesso ao atendimento"
          />
          <MyCustomDropdown
            title="local"
            text="Local do atendimento"
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
          <Input
            title="Protocolo"
            name="protocolo"
            type="text"
            hint="123/2023"
            required={false}
            register={register}
          />
          <div className={styles.buttonsBox}>
            <Button type="submit" name="Próxima" />
            <Button type="button" name="Cancelar" />
          </div>
        </form>
      </div>
    </>
  )
}
