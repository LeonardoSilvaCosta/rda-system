"use client"

import styles from './styles.module.scss';
import { PiTextAlignRightThin } from 'react-icons/pi';
import { FieldError, FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';
import InputMask from 'react-input-mask';
import { useRegisterClientContext } from '@/context/registerClientContext';

interface MaskedInputProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string,
  type: string,
  name: Path<T>,
  hint?: string,
  icon?: string,
  errors: FieldErrors<T>,
  register: UseFormRegister<T>,
  mask: string,
}

export function MaskedInput<T extends FieldValues>({ title, type, hint, name, errors, register, mask, onBlur }: MaskedInputProps<T>) {
  const { getValues, isCPFValid, isCPFUnique } = useRegisterClientContext();

  const errorKey = name as string;
  const isNested = name.includes('.');
  const nestedFields = isNested ? name.split('.') : [];
  const topLevelField = isNested ? nestedFields[0] : name;

  const getTypeOfIcon = () => {
    if (type === "text") {
      return <PiTextAlignRightThin className={styles.icon} />
    }
  }

  const contactsError = () => {
    if (isNested && nestedFields.length === 3 && errors[topLevelField]) {
      const topLevelError = errors[topLevelField] as Record<string, FieldError>;
      const indice = Number(topLevelError[nestedFields[1]]);
      const fieldName = nestedFields[2] as string;
      const nestedError = topLevelError[indice][fieldName] as FieldError;

      if (nestedError) {
        return (
          <span className="error-message">
            {nestedError.message}
          </span>
        );
      } else {
        return;
      }
    }
  }

  return (
    <div className={styles.inputContainer}>
      <label htmlFor={name}>{title}</label>
      <InputMask
        mask={mask}
        maskChar={""}
        type={type}
        defaultValue={getValues(name) ? getValues(name) : ""}
        placeholder={hint}
        {...register(name, { onBlur: onBlur })}
      />
      {getTypeOfIcon()}
      {!isCPFValid && (
        <span className="error-message">
          Informe um CPF válido.
        </span>
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