"use client"

import styles from './styles.module.scss';
import { FormValues, RegisterType, NameType, ClientFormValues } from '@/types/types';
import { useGlobalContext } from '@/context/form';
import { PiTextAlignRightThin } from 'react-icons/pi';

interface InputProps {
  title: string,
  type: string,
  name: NameType,
  hint?: string,
  icon?: string,
  register: RegisterType;
}

export function Input({ title, type, hint, name, register }: InputProps) {
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