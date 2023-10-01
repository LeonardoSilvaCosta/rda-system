import { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";
import { RadioButton } from '../RadioButton';
import styles from './styles.module.scss';
import { ClientFormValues, FormValues, Option } from '@/types/types';
import { LoadingComponent } from "../Loading/loading";
import { Suspense } from "react";

interface RadioGroupProps<T extends FieldValues> {
  title: string,
  name: Path<T>,
  options: Option[] | null,
  errors: FieldErrors<T>,
  register: UseFormRegister<T>,
}

export function RadioGroup<T extends FieldValues>({ title, name, options, errors, register }: RadioGroupProps<T>) {
  const errorKey = name as keyof FormValues | ClientFormValues;

  return (
    <div className={styles.radioGroup}>
      <label>{title}</label>
      {options?.map((e) => (
        <RadioButton
          key={e.id}
          id={e.id}
          label={e.name}
          name={name}
          register={register}
        />
      ))}
      {errors[errorKey] && (
        <span className={"error-message"}>{errors[errorKey]?.message}</span>
      )}
    </div>
  )
}