import {
  FieldError,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister
} from 'react-hook-form';

import { RadioButton } from '../RadioButton';
import styles from './styles.module.scss';

import { Option } from '@/types/types';

interface RadioGroupProps<T extends FieldValues> {
  title: string;
  name: Path<T>;
  options: Option[] | null;
  errors: FieldErrors<T>;
  register: UseFormRegister<T>;
}

export function RadioGroup<T extends FieldValues>({
  title,
  name,
  options,
  errors,
  register
}: RadioGroupProps<T>) {
  const errorKey = name as string;

  const isNested = name.includes('.');

  const nestedFields = isNested ? name.split('.') : [];
  const topLevelField = isNested ? nestedFields[0] : name;

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
