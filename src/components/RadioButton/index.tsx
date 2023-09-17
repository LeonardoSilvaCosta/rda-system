"use client"
import styles from "./styles.module.scss";
import { FormValues } from "@/types/types";
import { Path, UseFormRegister } from "react-hook-form";

interface RadioButtonProps {
  id: string,
  label: string,
  name: Path<FormValues>,
  required: boolean,
  register: UseFormRegister<FormValues>
}

export function RadioButton({ id, label, name, required, register }: RadioButtonProps) {
  return (
    <div className={styles.radioButtonContainer}>
      <input
        id={id}
        value={label}
        className={`${styles.input}`}
        type="radio"
        required={required}
        {...register(name)}
      />
      <label
        htmlFor={id} className={styles.label}>{label}</label>
    </div>
  )
}