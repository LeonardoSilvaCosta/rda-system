"use client"

import { Path, UseFormRegister } from 'react-hook-form';
import styles from './styles.module.scss';
import { FormValues } from '@/types/types';

interface InputProps {
  title: string,
  type: string,
  name: Path<FormValues>,
  hint?: string,
  icon?: string,
  register: UseFormRegister<FormValues>
  required: boolean,
}

export function Input({ title, type, hint, name, register }: InputProps) {
  return (
    <div className={styles.inputContainer}>
      <label htmlFor={name}>{title}</label>
      <input 
        type={type} 
        placeholder={hint}
        {...register(name)}
        />
    </div>
  )
}