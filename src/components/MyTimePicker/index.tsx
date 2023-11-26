import { useState } from 'react';
import TimePicker from 'react-time-picker';
import './MyTimePicker.css';
import './MyClock.css';

interface MyTimePickerProps<T extends FieldValues> {
  title: string;
  name: Path<T>;
  errors: FieldErrors<T>;
  control: Control<T>;
}
import styles from './styles.module.scss';

import {
  Control,
  Controller,
  FieldError,
  FieldErrors,
  FieldValues,
  Path
} from 'react-hook-form';

export function MyTimePicker<T extends FieldValues>({
  title,
  name,
  errors,
  control
}: MyTimePickerProps<T>) {
  const [time, setTime] = useState<string | null>(null);

  const errorKey = name as string;

  const isNested = name.includes('.');

  const nestedFields = isNested ? name.split('.') : [];
  const topLevelField = isNested ? nestedFields[0] : name;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className={styles.inputContainer}>
          <label>{title}</label>
          <TimePicker
            onChange={(value) => {
              field.onChange(value);
              setTime(value);
            }}
            value={time}
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
      )}
    />
  );
}
