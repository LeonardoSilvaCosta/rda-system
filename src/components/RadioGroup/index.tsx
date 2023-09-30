import { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";
import { RadioButton } from '../RadioButton';
import styles from './styles.module.scss';
import { ClientFormValues, FormValues } from '@/types/types';

interface RadioGroupProps<T extends FieldValues> {
  title: string,
  name: Path<T>,
  label1: string,
  label2: string,
  errors: FieldErrors<T>,
  register: UseFormRegister<T>,
}

export function RadioGroup<T extends FieldValues>({ title, name, label1, label2, errors, register }: RadioGroupProps<T>) {
  const errorKey = name as keyof FormValues | ClientFormValues;

  return (
    <div className={styles.radioGroup}>
      <label>{title}</label>
      <RadioButton
        id={label1}
        label={label1}
        name={name}
        register={register}
      />
      <RadioButton
        id={label2}
        label={label2}
        name={name}
        register={register}
      />
      {errors[errorKey] && (
        <span className={"error-message"}>{errors[errorKey]?.message}</span>
      )}
    </div>
  )
}