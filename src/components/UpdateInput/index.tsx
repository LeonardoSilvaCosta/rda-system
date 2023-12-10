'use client';

import {
  FieldError,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister
} from 'react-hook-form';

import styles from './styles.module.scss';

interface UpdateInputProps<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string;
  type: string;
  name: Path<T>;
  icon?: string;
  errors: FieldErrors<T>;
  register: UseFormRegister<T>;
  isSubmitted?: boolean;
  selectedValue: string;
}

export function UpdateInput<T extends FieldValues>({
  title,
  type,
  name,
  errors,
  register,
  onBlur,
  selectedValue,
  disabled
}: UpdateInputProps<T>) {
  const errorKey = name as string;

  const isNested = name.includes('.');

  const nestedFields = isNested ? name.split('.') : [];
  const topLevelField = isNested ? nestedFields[0] : name;

  return (
    <div className={styles.inputContainer}>
      <label htmlFor={name}>{title}</label>
      <input
        type={type}
        defaultValue={selectedValue}
        {...register(name, {
          disabled: disabled,
          onBlur: onBlur
        })}
      />
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
    </div>
  );
}
