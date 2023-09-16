"use client"
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";


import "react-datepicker/dist/react-datepicker.css";
import br from 'date-fns/locale/pt-BR';

registerLocale('br', br)

import { useState } from 'react';

import { AiOutlineCalendar } from "react-icons/ai";

import styles from './styles.module.scss';


export function MyDatePicker() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className={styles.inputContainer}>
      <label>Data</label>
      <DatePicker
        className={styles.input}
        selected={selectedDate}
        dateFormat="dd/MM/yyyy"
        placeholderText="15/09/2023"
        locale="br"
        onChange={date => setSelectedDate(date)}
      />
      <AiOutlineCalendar className={styles.icon} />
    </div>
  )
}