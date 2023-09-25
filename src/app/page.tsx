"use client"
import { Header } from "@/components/Header";

import styles from './styles.module.scss';

import { useForm, SubmitHandler } from "react-hook-form";
import { FormValues } from "@/types/types";
import { useGlobalContext } from "@/context/store";

export default function Home() {
  const {
    handleSubmit,
  } = useForm<FormValues>()

  const { currentStep, currentComponent, changeStep } = useGlobalContext();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    changeStep(currentStep + 1)
    console.log(currentStep)
    }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
        >
          {currentComponent}
        </form>
      </div>
    </>
  )
}
