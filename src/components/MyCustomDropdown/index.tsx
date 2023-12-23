'use client';
import React, {
  useState,
  useEffect,
  useRef,
  SetStateAction,
  Dispatch
} from 'react';
import {
  Control,
  Controller,
  FieldError,
  FieldErrors,
  FieldPath,
  FieldValues,
  UseFormGetValues
} from 'react-hook-form';
import { BsChevronDown } from 'react-icons/bs';

import styles from './styles.module.scss';

import { Option, QueryObject } from '@/types/types';
import classnames from 'classnames';

interface MyCustomDropdownProps<T extends FieldValues> {
  title: string;
  fieldName: FieldPath<T>;
  options: Option[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getValues: UseFormGetValues<any>;
  errors: FieldErrors<T>;
  control: Control<T>;
  selectedState?: string;
  setSelectedState?: Dispatch<SetStateAction<string>>;
  routeToSearch: string;
}

export function MyCustomDropdown<T extends FieldValues>({
  title,
  fieldName,
  options,
  getValues,
  errors,
  control,
  setSelectedState,
  routeToSearch
}: MyCustomDropdownProps<T>) {
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<Option[]>(options);
  const [query, setQuery] = useState('');

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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
  }, [isDropDownVisible, options]);

  useEffect(() => {
    setFilteredData(options);
  }, [options]);

  useEffect(() => {
    setQuery(buttonDefaultValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buttonDefaultValue = () => {
    if (selectedItemId) {
      const selectedOption = options.find(
        (option) => option.id === selectedItemId
      );
      return selectedOption ? selectedOption.name : '';
    } else if (getValues(fieldName)) {
      const selectedOption = options.find(
        (option) => option.id === getValues(fieldName)
      );
      return selectedOption ? selectedOption.name : '';
    } else {
      return '';
    }
  };

  const handleChangeInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    const qToLower = q.toLowerCase();
    setQuery(q);

    const lastCharacter = routeToSearch.slice(-1);

    const queryCharacter = lastCharacter === '&' ? '&' : '?';

    if (q !== '') {
      const res = await fetch(`${routeToSearch}${queryCharacter}q=${qToLower}`);
      const data = await res.json();
      if (!data) return;
      const filteredData = data.map((e: QueryObject) => {
        if (e.rg) {
          return {
            id: e.id,
            name: `${e.rank} ${e.cadre} RG ${e.rg} ${e.nickname}`
          };
        } else if (e.fullname) {
          return {
            id: e.id,
            name: `${e.fullname} - ${e.cpf}`
          };
        } else {
          return {
            id: e.id,
            name: e.name
          };
        }
      });
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
        className={classnames(styles.selectMenu, {
          [styles.visible]: isDropDownVisible
        })}
      >
        <div>
          <input
            className={classnames(styles.selectInput, {
              [styles.visible]: isDropDownVisible
            })}
            type="text"
            name="search"
            autoComplete={'off'}
            value={query}
            placeholder={'Selecione uma opção'}
            onChange={(e) => handleChangeInput(e)}
            onClick={() => {
              setIsDropDownVisible(true);
            }}
          />
          <BsChevronDown
            onClick={() => {
              setIsDropDownVisible(!isDropDownVisible);
            }}
            className={classnames(styles.chevronDown, {
              [styles.visible]: isDropDownVisible
            })}
          />
        </div>
        {isDropDownVisible && (
          <ul className={styles.options}>
            {filteredData.length > 0 ? (
              <>
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
                            setQuery(item.name);
                          }}
                        >
                          <i className={styles.optionIcon} />
                          <span className={styles.optionText}>{item.name}</span>
                        </li>
                      </div>
                    )}
                  />
                ))}
              </>
            ) : (
              <li
                className={styles.option}
                onClick={() => {
                  setIsDropDownVisible(false);
                  setQuery('');
                  setFilteredData(options);
                }}
              >
                <span className={styles.optionText}>
                  Não há resultados para essa busca.
                </span>
              </li>
            )}
          </ul>
        )}
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
    </div>
  );
}
