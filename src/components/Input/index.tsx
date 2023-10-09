"use client"

import styles from './styles.module.scss';
import { PiTextAlignRightThin } from 'react-icons/pi';
import { FieldError, FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface InputProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string,
  type: string,
  name: Path<T>,
  hint?: string,
  icon?: string,
  errors: FieldErrors<T>,
  register: UseFormRegister<T>,
}

export function Input<T extends FieldValues>({ title, type, hint, name, errors, register, onBlur }: InputProps<T>) {

  const errorKey = name as string;

  const isNested = name.includes('.');

  const nestedFields = isNested ? name.split('.') : [];
  const topLevelField = isNested ? nestedFields[0] : name;

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
        {...register(name, { onBlur: onBlur })}
      />
      {getTypeOfIcon()}
      {errors[errorKey] && (
        <span className="error-message">
          {String(errors[errorKey]?.message)}
        </span>
      )}
      {isNested && nestedFields.length === 2 && errors[topLevelField] && (
        <span className="error-message">
          {(errors[topLevelField] as Record<string, FieldError>)[nestedFields[1]]?.message}
        </span>
      )}
      {isNested && nestedFields.length === 3 && errors[topLevelField] && (
        <span className="error-message">
           {(errors[topLevelField] as Record<string, FieldError>)[nestedFields[1]][nestedFields[2]]?.message}
        </span>
      )}
    </div>
  )
}