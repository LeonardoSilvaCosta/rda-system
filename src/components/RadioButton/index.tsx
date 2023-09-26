"use client"
import styles from "./styles.module.scss";
import { FormValues, RegisterType, NameType } from "@/types/types";
import { Path, UseFormRegister } from "react-hook-form";

interface RadioButtonProps {
  id: string,
  label: string,
  name: NameType,
  register: RegisterType
}

export function RadioButton({ id, label, name, register }: RadioButtonProps) {
  return (
    <div className={styles.radioButtonContainer}>
      <input
        id={id}
        value={label}
        className={`${styles.input}`}
        type="radio"
        {...register(name)}
      />
      <label
        htmlFor={id} className={styles.label}>{label}</label>
    </div>
  )
}