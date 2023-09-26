import React, { useState, useEffect, useRef } from 'react';
import classnames from 'classnames';
import styles from './styles.module.scss';
import { BsChevronDown } from "react-icons/bs";
import { Control, Controller, FieldPath } from 'react-hook-form';
import { ControlType, FieldType, FormValues } from '@/types/types';
import { useGlobalContext } from '@/context/form';

interface MyCustomDropdownProps {
  title: string;
  fieldName: FieldType;
  options: Option[];
  control: ControlType;
}

type Option = {
  value: string;
}

export function MyCustomDropdown({ title, fieldName, options, control }: MyCustomDropdownProps) {
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { errors, getValues } = useGlobalContext();
  const errorKey = fieldName as keyof FormValues;

  const closeDropdown = () => {
    setIsDropDownVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isDropDownVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropDownVisible]);

  const buttonDefaultValue = () => {
    if (selectedItemIndex !== null && !getValues(fieldName)) {
      return options[selectedItemIndex].value
    } else if (getValues(fieldName)) {
      return getValues(fieldName)
    } else {
      return <span>Selecione uma opção</span>
    }
  }

  return (
    <div className={styles.dropdownContainer}>
      <label htmlFor={title}>{title}</label>
      <div
        ref={dropdownRef}
        className={classnames(styles.selectMenu, { [styles.visible]: isDropDownVisible })}
        onClick={() => setIsDropDownVisible(!isDropDownVisible)}
      >
        <div className={classnames(styles.selectButton, { [styles.visible]: isDropDownVisible })}>
          {buttonDefaultValue()}
          <BsChevronDown className={classnames(styles.chevronDown, { [styles.visible]: isDropDownVisible })} />
        </div>
        {errors[errorKey] && (
          <span className={"error-message"}>{errors[errorKey]?.message}</span>
        )}
        {isDropDownVisible && (
          <ul className={styles.options}>
            {options.map((item, index) => (
              <Controller
                key={item.value}
                control={control}
                name={fieldName}
                render={({ field }) => (
                  <div className={styles.inputContainer}>
                    <li
                      className={styles.option}
                      onClick={() => {
                        setSelectedItemIndex(index);
                        setIsDropDownVisible(false);
                        field.onChange(item.value);
                      }}
                    >
                      <i className={styles.optionIcon} />
                      <span className={styles.optionText}>{item.value}</span>
                    </li>
                  </div>
                )}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
