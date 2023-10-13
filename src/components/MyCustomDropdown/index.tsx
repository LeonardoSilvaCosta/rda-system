"use client"
import React, { useState, useEffect, useRef, SetStateAction, Dispatch } from 'react';
import classnames from 'classnames';
import styles from './styles.module.scss';
import { BsChevronDown } from "react-icons/bs";
import { Control, Controller, FieldError, FieldErrors, FieldPath, FieldValues, UseFormGetValues } from 'react-hook-form';
import { Option } from '@/types/types';

interface MyCustomDropdownProps<T extends FieldValues> {
  title: string;
  fieldName: FieldPath<T>;
  options: Option[];
  getValues: UseFormGetValues<any>;
  errors: FieldErrors<T>,
  control: Control<T>;
  selectedState?: string;
  setSelectedState?: Dispatch<SetStateAction<string>>;
  routeToSearch: string,
}

export function MyCustomDropdown<T extends FieldValues>({ title, fieldName, options, getValues, errors, control, setSelectedState, routeToSearch }: MyCustomDropdownProps<T>) {
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<Option[]>(options);
  const [query, setQuery] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  const errorKey = fieldName as string;

  const isNested = fieldName.includes('.');

  const nestedFields = isNested ? fieldName.split('.') : [];
  const topLevelField = isNested ? nestedFields[0] : fieldName;

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

  useEffect(() => {
    setFilteredData(options)
  }, [options])

  useEffect(() => {
    setQuery(buttonDefaultValue())
  }, [getValues(fieldName)])

  const buttonDefaultValue = () => {
    if (selectedItemId) {
      const selectedOption = options.find(option => option.id === selectedItemId);
      return selectedOption ? selectedOption.name : "";
    } else if (getValues(fieldName)) {
      const selectedOption = options.find(option => option.id === getValues(fieldName));
      return selectedOption ? selectedOption.name : "";
    } else {
      return "";
    }
  }

  const handleChangeInput = async (e: any) => {
    const q = e.target.value;
    const qToLower = q.toLowerCase();
    setQuery(q);

    if (q !== "") {
      const res = await fetch(`${routeToSearch}?q=${qToLower}`);
      const data = await res.json();
      if (!data) return;
      const filteredData = data.map((e: any) => {
        return {
          id: e.id,
          name: e.name ? e.name : `${e.rank} ${e.cadre} RG ${e.rg} ${e.nickname}`
        }
      })
      setFilteredData(filteredData);
    } else {
      setFilteredData(options);
    }
  };

  return (
    <div className={styles.dropdownContainer}>
      <label htmlFor={title}>{title}</label>
      <div
        ref={dropdownRef}
        className={classnames(styles.selectMenu, { [styles.visible]: isDropDownVisible })}
        onClick={() => { setIsDropDownVisible(!isDropDownVisible) }}
      >
        <div>
          <input
            className={classnames(styles.selectInput, { [styles.visible]: isDropDownVisible })}
            type="text"
            name="search"
            autoComplete={'off'}
            value={query}
            placeholder={'Selecione uma opção'}
            onChange={(e) => handleChangeInput(e)}
          />
          <BsChevronDown className={classnames(styles.chevronDown, { [styles.visible]: isDropDownVisible })} />
        </div>
        <br />
        {errors[errorKey] && (
          <span className="error-message">
            {String(errors[errorKey]?.message)}
          </span>
        )}
        {isNested && nestedFields.length === 2 && errors[topLevelField] && (
          <span className="error-message">
            {(errors[topLevelField] as Record<string, FieldError>)[nestedFields[1]]?.message}
          </span>
        )}
        {isNested && nestedFields.length === 3 && errors[topLevelField] && (
          <span className="error-message">
            {(errors[topLevelField] as Record<string, FieldError>)[nestedFields[1]][nestedFields[2]]?.message}
          </span>
        )}
        {isDropDownVisible && (
          <ul className={styles.options}>
            {filteredData.map((item) => (
              <Controller
                key={item.id}
                control={control}
                name={fieldName}
                render={({ field }) => (
                  <div className={styles.inputContainer}>
                    <li
                      className={styles.option}
                      onClick={() => {
                        setSelectedState && setSelectedState(item.id);
                        setSelectedItemId(item.id);
                        setIsDropDownVisible(false);
                        field.onChange(item.id);
                        setQuery(item.name)
                      }}
                    >
                      <i className={styles.optionIcon} />
                      <span className={styles.optionText}>{item.name}</span>
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
