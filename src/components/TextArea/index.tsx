'use client';

import {
  FieldError,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister
} from 'react-hook-form';

import styles from './styles.module.scss';

interface TextAreaProps<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string;
  name: Path<T>;
  hint?: string;
  icon?: string;
  errors: FieldErrors<T>;
  register: UseFormRegister<T>;
}

export function TextArea<T extends FieldValues>({
  title,
  hint,
  name,
  errors,
  register,
  onBlur
}: TextAreaProps<T>) {
  const errorKey = name as string;

  const isNested = name.includes('.');

  const nestedFields = isNested ? name.split('.') : [];
  const topLevelField = isNested ? nestedFields[0] : name;

  return (
    <div className={styles.inputContainer}>
      <label htmlFor={name}>{title}</label>
      <textarea
        placeholder={hint}
        {...register(name, { onBlur: onBlur })}
      ></textarea>
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
