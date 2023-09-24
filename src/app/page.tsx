"use client"
import { Header } from "@/components/Header";

import styles from './styles.module.scss';

import { useForm, SubmitHandler } from "react-hook-form";
import { FormValues } from "@/types/types";
import { RDAFirstForm } from "@/components/RDAFirstForm";
import { RDASecondForm } from "@/components/RDASecondForm";
import { RDAThirdForm } from "@/components/RDAThirdForm";
import { MyCustomMultiSelectDropdown } from "@/components/MyCustomMultiselectDropdown";
import { list1, list2 } from "@/data";
import { BsChevronDown } from "react-icons/bs";
import MultiselectDropdown from "@/components/MultiselectDropdown";
import { useState } from "react";

export default function Home() {
  const {
    register,
    handleSubmit,
    watch,
    control
  } = useForm<FormValues>()

  const onSubmit: SubmitHandler<FormValues> = (data: any) => console.log(data)

  const [selected, setSelected] = useState([])

  return (
    <>
      <Header />
      <div className={styles.container}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* <RDAFirstForm register={register} control={control} watch={watch} />
          <RDASecondForm register={register} control={control} watch={watch}/>
          <RDAThirdForm register={register} control={control} watch={watch}/> */}
            <h2>Novo multiselect dropdown</h2>
          <MyCustomMultiSelectDropdown
            title="Oficial"
            fieldName="oficial"
            options={list2}
            control={control} />
            {/* <MultiselectDropdown /> */}
        </form>
      </div>
    </>
  )
}
