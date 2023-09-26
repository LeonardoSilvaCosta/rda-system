"use client"

import { useGlobalContext } from "@/context/store";
import { FormValues } from "@/types/types";
import { SubmitHandler } from "react-hook-form";

import styles from './styles.module.scss';

export function MyForm() {
  const {
    handleSubmit,
    changeStep,
    currentStep
  } = useGlobalContext();

  const { currentComponent } = useGlobalContext();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    changeStep(currentStep + 1)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
    >
      {currentComponent}
    </form>
  )
}