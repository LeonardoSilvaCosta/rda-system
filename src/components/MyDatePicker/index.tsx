"use client"
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import classnames from 'classnames';


import "react-datepicker/dist/react-datepicker.css";
import br from 'date-fns/locale/pt-BR';

registerLocale('br', br)

import { useState } from 'react';

import { AiOutlineCalendar } from "react-icons/ai";

import styles from './styles.module.scss';
import { Controller, Control, Path, FieldErrors, FieldValues } from "react-hook-form";
import { ClientFormValues } from "@/types/types";

interface MyDatePickerProps<T extends FieldValues> {
  title: string,
  name: Path<T>,
  hint?: string,
  icon?: string,
  errors: FieldErrors<T>,
  control: Control<T>,
}

export function MyDatePicker<T extends FieldValues>({ title, name, hint, icon, errors, control }: MyDatePickerProps<T>) {
  const [isDatapickerVisible, setIsDatapickerVisible] = useState(false);
  const errorKey = name as keyof ClientFormValues;

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
          />
          {errors[errorKey] && (
            <span className={"error-message"}>{errors[errorKey]?.message}</span>
          )}
          <AiOutlineCalendar className={classnames(styles.icon, { [styles.hide]: isDatapickerVisible })} />
        </div>
      )}
    />
  )
}