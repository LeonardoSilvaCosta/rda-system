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
import { list1, list2, list3, list4 } from "@/data";

export default function Home() {
  const {
    register,
    handleSubmit,
    watch,
    control
  } = useForm<FormValues>()

  const watchTemProtocolo = watch("temProtocolo");

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
        </form>
      </div>
    </>
  )
}
