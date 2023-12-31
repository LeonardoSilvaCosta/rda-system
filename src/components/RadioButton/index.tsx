'use client';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

import styles from './styles.module.scss';

interface RadioButtonProps<T extends FieldValues> {
  id: string;
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  selectedOption?: string;
  className?: string;
}

export function RadioButton<T extends FieldValues>({
  id,
  label,
  name,
  register,
  selectedOption,
  className
}: RadioButtonProps<T>) {
  return (
    <div
      className={`${styles.radioButtonContainer} ${
        className && styles[className]
      }`}
    >
      <input
        id={id}
        value={id}
        className={`${styles.input}`}
        type="radio"
        {...register(name)}
        defaultChecked={selectedOption === id}
      />
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
    </div>
  );
}
