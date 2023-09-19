"use client"
import { useState } from 'react';
import styles from './styles.module.scss';

import { BsChevronDown } from "react-icons/bs";
import { UseFormRegister } from 'react-hook-form';
import { FormValues } from '@/types/types';

interface MyCustomDropdonwProps {
  title: string,
  options: Option[];
  register: UseFormRegister<FormValues>
}

type Option = {
  name: string;
  value: string;
}

export function MyCustomDropdown({ title, options, register }: MyCustomDropdonwProps) {
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);

  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  return (
    <div className={styles.dropdownContainer}>
      <label htmlFor={title}>{title}</label>
      <div
        className={`${styles.selectMenu} ${isDropDownVisible ? styles.visible : ''}`}
        onClick={() => { setIsDropDownVisible(!isDropDownVisible); }}
      >
        <div className={`${styles.selectButton} ${isDropDownVisible ? styles.visible : ''}`}>
          {selectedItemIndex !== null ? options[selectedItemIndex].name : <span>Selecione uma opção</span>}
          <BsChevronDown className={`${styles.chevronDown} ${isDropDownVisible ? styles.visible : ''}`} />
        </div>
        {
          isDropDownVisible ? (
            <ul className={styles.options}>
              {
                options.map((item, index) => (
                  <li
                    key={item.value}
                    className={styles.option}
                    onClick={() => {
                      setSelectedItemIndex(index);
                      setIsDropDownVisible(false);
                    }}
                  >
                    <i className={styles.optionIcon} />
                    <span className={styles.optionText}>{item.name}</span>
                  </li>
                ))
              }
            </ul>
          ) : <></>
        }
      </div>
    </div>
  )
}