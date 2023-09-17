import { UseFormRegister, Path } from "react-hook-form";
import { RadioButton } from '../RadioButton';
import styles from './styles.module.scss';
import { FormValues } from '@/types/types';


interface RadioGroupProps {
  title: string;
  name: Path<FormValues>,
  label1: string;
  label2: string;
  required: boolean,
  register: UseFormRegister<FormValues>
}

export function RadioGroup({ title, name, label1, label2, required, register }: RadioGroupProps) {
  return (
    <div className={styles.radioGroup}>
      <label>{title}</label>
      <RadioButton
        id={label1}
        label={label1}
        name={name}
        required={required}
        register={register}
      />
      <RadioButton
        id={label2}
        label={label2}
        name={name}
        required={required}
        register={register}
      />
    </div>
  )
}