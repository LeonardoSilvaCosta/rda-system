'use client';
import { useState } from 'react';
import { registerLocale } from 'react-datepicker';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

registerLocale('br', br);
import {
  Controller,
  Control,
  Path,
  FieldErrors,
  FieldValues,
  FieldError
} from 'react-hook-form';
import { AiOutlineCalendar } from 'react-icons/ai';
import InputMask from 'react-input-mask';

import styles from './styles.module.scss';

import classnames from 'classnames';
import br from 'date-fns/locale/pt-BR';

interface MyDatePickerProps<T extends FieldValues> {
  title: string;
  name: Path<T>;
  hint?: string;
  icon?: string;
  errors: FieldErrors<T>;
  control: Control<T>;
}

export function MyDatePicker<T extends FieldValues>({
  title,
  name,
  errors,
  control
}: MyDatePickerProps<T>) {
  const [isDatapickerVisible, setIsDatapickerVisible] = useState(false);
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
          <DatePicker
            className={styles.input}
            selected={field.value as Date}
            dateFormat="dd/MM/yyyy"
            placeholderText="15/09/2023"
            locale="br"
            onBlur={() => setIsDatapickerVisible(false)}
            onFocus={() => setIsDatapickerVisible(true)}
            onChange={(date) => field.onChange(date)}
            customInput={
              <InputMask mask="99/99/9999" placeholder="dd/MM/yyyy" />
            }
          />
          <AiOutlineCalendar
            className={classnames(styles.icon, {
              [styles.hide]: isDatapickerVisible
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
      )}
    />
  );
}
