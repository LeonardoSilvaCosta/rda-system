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
import { Controller, Control, Path } from "react-hook-form";
import { FormValues } from "@/types/types";

interface MyDatePickerProps {
  title: string,
  name: Path<FormValues>,
  hint?: string,
  icon?: string,
  required: boolean,
  control: Control<FormValues>,
}

export function MyDatePicker({ title, name, hint, icon, control, required }: MyDatePickerProps) {
  const [isDatapickerVisible, setIsDatapickerVisible] = useState(false);

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
          <AiOutlineCalendar className={classnames(styles.icon, { [styles.hide]: isDatapickerVisible })} />
        </div>
      )}
    />
  )
}