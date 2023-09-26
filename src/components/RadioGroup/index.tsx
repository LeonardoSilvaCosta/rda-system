import { UseFormRegister, Path } from "react-hook-form";
import { RadioButton } from '../RadioButton';
import styles from './styles.module.scss';
import { FormValues } from '@/types/types';
import { useGlobalContext } from "@/context/store";

interface RadioGroupProps {
  title: string;
  name: Path<FormValues>,
  label1: string;
  label2: string;
  register: UseFormRegister<FormValues>
}

export function RadioGroup({ title, name, label1, label2, register }: RadioGroupProps) {
  const { errors } = useGlobalContext();
  const errorKey = name as keyof FormValues;

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