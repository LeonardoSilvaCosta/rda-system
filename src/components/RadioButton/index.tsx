"use client"
import { useState } from "react";
import styles from "./styles.module.scss";

interface RadioButtonProps {
  id?: string;
  label: string;
  name: string;
}

export function RadioButton({ id, label, name }: RadioButtonProps) {
  const [isChecked, setIsChecked] = useState<boolean | undefined>();

  return (
    <div className={styles.radioButtonContainer}>
      <input checked={isChecked} id={id} className={`${styles.input}`} type="radio" name={name} />
      <label onClick={e => {
        setIsChecked(e);
      }} htmlFor={id} className={styles.label}>{label}</label>
    </div>
  )
}