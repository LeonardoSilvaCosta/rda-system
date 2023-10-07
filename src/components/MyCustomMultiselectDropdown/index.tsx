import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import styles from './styles.module.scss';
import { BsChevronDown, BsCheckLg } from "react-icons/bs";
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { FormValues } from '@/types/types';
import { SearchBar } from '../SearchBar';
import { useGlobalContext } from '@/context/form';

interface MyCustomMultiselectDropdownProps<T extends FieldValues> {
  title: string;
  fieldName: FieldPath<T>;
  options: Option[];
  control: Control<T>;
}

type Option = {
  value: string;
}

export function MyCustomMultiSelectDropdown<T extends FieldValues>({ title, fieldName, options, control }: MyCustomMultiselectDropdownProps<T>) {
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");

  const { errors, getValues } = useGlobalContext();
  const errorKey = fieldName as string;

  const lowerSearch = search.toLocaleLowerCase();

  const filteredList = options.filter((item) =>
    item.value
      .toLocaleLowerCase()
      .includes(lowerSearch));

  const closeDropdown = () => {
    setIsDropDownVisible(false);
  };

  const toggleOption = (value: string) => {
    if (selectedOptions.includes(value)) {
      setSelectedOptions(selectedOptions.filter((option) => option !== value));
    } else {
      setSelectedOptions([...selectedOptions, value]);
    }
  };

  const selectButtonLabel = () => {
    if (selectedOptions.length == 1) {
      return <span>{`${selectedOptions.length} item selecionado`}</span>
    } else if (selectedOptions.length > 1) {
      return <span>{`${selectedOptions.length} itens selecionados`}</span>
    } else {
      return <span>Selecione uma opção</span>
    }
  }

  const insertItens = (value: string) => {
    const updatedSelectedOptions = selectedOptions.includes(value)
      ? selectedOptions.filter((option) => option !== value)
      : [...selectedOptions, value];

    return updatedSelectedOptions;
  }

  const deleteItens = (value: string) => {
    const updatedSelectedOptions = selectedOptions.filter((item) => item !== value);
    return updatedSelectedOptions;
  }

  useEffect(() => {
    if(getValues(fieldName)) {
      setSelectedOptions(getValues(fieldName))
    }
  }, [])

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

  return (
    <div className={styles.dropdownContainer}>
      <label htmlFor={title}>{title}</label>
      <div
        ref={dropdownRef}
        className={classnames(styles.selectMenu, { [styles.visible]: isDropDownVisible })}
      >
        <div
          className={classnames(styles.selectButton, { [styles.visible]: isDropDownVisible })}
          onClick={() => setIsDropDownVisible(!isDropDownVisible)}
        >
          {selectButtonLabel()}
          <i
            className={classnames(styles.chevronDown, { [styles.visible]: isDropDownVisible })}
          >
            <BsChevronDown />
          </i>
        </div>
        {errors[errorKey] && (
          <span className={"error-message"}>{errors[errorKey]?.message}</span>
        )}
        {isDropDownVisible && (
          <>
            {selectedOptions.length > 0 && (
              <ul className={styles.selectedItensBox}>
                {selectedOptions.map((item) => (
                  <Controller
                    key={item}
                    control={control}
                    name={fieldName}
                    render={({ field }) => (
                      <li
                        key={item}
                        className={styles.selectedItem}
                        onClick={() => {
                          field.onChange(deleteItens(item))
                        }}
                      >
                        {item}
                        <span
                          className={styles.removeItemButton}
                          onClick={() => toggleOption(item)}
                        >x</span>
                      </li>
                    )}
                  />
                ))}
              </ul>
            )}
            <ul className={styles.options}>
              <SearchBar list={options} search={search} setSearch={setSearch} />
              {filteredList.map((item) => (
                <Controller
                  key={item.value}
                  control={control}
                  name={fieldName}
                  render={({ field }) => (
                    <div className={styles.inputContainer}>
                      <li
                        className={classnames(styles.option, {
                          checked: selectedOptions.includes(item.value),
                        })}
                        onClick={() => {
                          toggleOption(item.value);
                          field.onChange(insertItens(item.value));
                        }}
                      >
                        <span className={styles.checkbox}>
                          {selectedOptions.includes(item.value) && (
                            <i className={styles.checkIcon}><BsCheckLg /></i>
                          )}
                        </span>
                        <i className={styles.optionIcon} />
                        <span className={styles.optionText}>{item.value}</span>
                      </li>
                    </div>
                  )}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
