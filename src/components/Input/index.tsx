"use client"

import { Path, UseFormRegister } from 'react-hook-form';
import styles from './styles.module.scss';
import { FormValues } from '@/types/types';
import { useGlobalContext } from '@/context/form';

interface InputProps {
  title: string,
  type: string,
  name: Path<FormValues>,
  hint?: string,
  icon?: string,
  register: UseFormRegister<FormValues>
}

export function Input({ title, type, hint, name, register }: InputProps) {
  const { errors } = useGlobalContext();
  const errorKey = name as keyof FormValues;

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
    </div>
  )
}