'use client';

import {
  FieldError,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister
} from 'react-hook-form';
import InputMask from 'react-input-mask';

import styles from './styles.module.scss';

import { useRegisterClientContext } from '@/context/registerClientContext';

interface UpdateMaskedInputProps<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string;
  type: string;
  name: Path<T>;
  hint?: string;
  icon?: string;
  errors: FieldErrors<T>;
  register: UseFormRegister<T>;
  selectedValue: string | null;
  mask: string;
}

export function UpdateMaskedInput<T extends FieldValues>({
  title,
  type,
  hint,
  name,
  errors,
  register,
  mask,
  selectedValue,
  onBlur
}: UpdateMaskedInputProps<T>) {
  const { isCPFValid, isCPFUnique } = useRegisterClientContext();

  const errorKey = name as string;
  const isNested = name.includes('.');
  const nestedFields = isNested ? name.split('.') : [];
  const topLevelField = isNested ? nestedFields[0] : name;

  return (
    <div className={styles.inputContainer}>
      <label htmlFor={name}>{title}</label>
      <InputMask
        mask={mask}
        type={type}
        defaultValue={selectedValue ? selectedValue : ''}
        placeholder={hint}
        {...register(name, { onBlur: onBlur })}
      />
      {!isCPFValid && (
        <span className="error-message">Informe um CPF válido.</span>
      )}
      {!isCPFUnique && (
        <span className="error-message">
          Já há um atendido cadastrado com esse CPF.
        </span>
      )}
      {errors[errorKey] && (
        <span className="error-message">
          {String(errors[errorKey]?.message)}
        </span>
      )}
      {isNested && nestedFields.length === 2 && errors[topLevelField] && (
        <span className="error-message">
          {
            (errors[topLevelField] as Record<string, FieldError>)[
              nestedFields[1]
            ]?.message
          }
        </span>
      )}
      {isNested && nestedFields.length === 3 && errors[topLevelField] && (
        <span className="error-message">
          {
            (errors[topLevelField] as Record<string, FieldError>)[
              nestedFields[1]
            ]?.message
          }
        </span>
      )}
    </div>
  );
}
