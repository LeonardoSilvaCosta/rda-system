"use client"

import styles from './styles.module.scss';
import { FormValues } from '@/types/types';
import { useGlobalContext } from '@/context/form';
import { PiTextAlignRightThin } from 'react-icons/pi';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface InputProps<T extends FieldValues> {
  title: string,
  type: string,
  name: Path<T>,
  hint?: string,
  icon?: string,
  register: UseFormRegister<T>,
}

export function Input<T extends FieldValues>({ title, type, hint, name, register }: InputProps<T>) {
  const { errors } = useGlobalContext();
  const errorKey = name as keyof FormValues;

  const getTypeOfIcon = () => {
    if (type === "text") {
      return <PiTextAlignRightThin className={styles.icon} />
    }
  }

  return (
    <div className={styles.inputContainer}>
      <label htmlFor={name}>{title}</label>
      <input
        type={type}
        placeholder={hint}
        {...register(name)}
      />
      {errors[errorKey] && (
        <span className={"error-message"}>{errors[errorKey]?.message}</span>
      )}
      {getTypeOfIcon()}
    </div>
  )
}