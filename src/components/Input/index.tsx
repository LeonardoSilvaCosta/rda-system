"use client"

import styles from './styles.module.scss';
import { Address, ClientFormValues, FormValues } from '@/types/types';
import { PiTextAlignRightThin } from 'react-icons/pi';
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface InputProps<T extends FieldValues> {
  title: string,
  type: string,
  name: Path<T>,
  hint?: string,
  icon?: string,
  getAddressInfo?: (cep: string) => Promise<void>
  errors: FieldErrors<T>,
  register: UseFormRegister<T>,
}

export function Input<T extends FieldValues>({ title, type, hint, name, getAddressInfo, errors, register }: InputProps<T>) {
  const errorKey = name as keyof FormValues | ClientFormValues;

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
        {...register(name, { onBlur: getAddressInfo ? (e: any) => getAddressInfo(e) : undefined })}
      />
      {errors[errorKey] && (
        <span className={"error-message"}>{errors[errorKey]?.message}</span>
      )}
      {getTypeOfIcon()}
    </div>
  )
}