import React, { useState, useRef, useEffect } from 'react';
import {
  Control,
  Controller,
  FieldError,
  FieldErrors,
  FieldPath,
  FieldValues,
  UseFormGetValues
} from 'react-hook-form';
import { BsChevronDown, BsCheckLg } from 'react-icons/bs';

import { SearchBar } from '../SearchBar';
import styles from './styles.module.scss';

import { QueryObject, Option } from '@/types/types';
import classnames from 'classnames';

interface MyCustomMultiselectDropdownProps<T extends FieldValues> {
  title: string;
  fieldName: FieldPath<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getValues: UseFormGetValues<any>;
  options: Option[];
  control: Control<T>;
  errors: FieldErrors<T>;
  routeToSearch: string;
}

export function MyCustomMultiSelectDropdown<T extends FieldValues>({
  title,
  fieldName,
  getValues,
  options,
  control,
  errors,
  routeToSearch
}: MyCustomMultiselectDropdownProps<T>) {
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [filteredData, setFilteredData] = useState<Option[]>(options);

  const [query, setQuery] = useState('');

  const errorKey = fieldName as string;

  const isNested = fieldName.includes('.');

  const nestedFields = isNested ? fieldName.split('.') : [];
  const topLevelField = isNested ? nestedFields[0] : fieldName;

  const closeDropdown = () => {
    setIsDropDownVisible(false);
  };

  const toggleOption = (option: Option) => {
    if (selectedOptions.map((e) => e.name).includes(option.name)) {
      setSelectedOptions(
        selectedOptions.filter((item) => item.name !== option.name)
      );
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const selectButtonLabel = () => {
    if (selectedOptions.length == 1) {
      return <span>{`${selectedOptions.length} item selecionado`}</span>;
    } else if (selectedOptions.length > 1) {
      return <span>{`${selectedOptions.length} itens selecionados`}</span>;
    } else {
      return <span>Selecione uma opção</span>;
    }
  };

  const convertToDeleteAndToInsert = (options: Option[]) => {
    return options.map((e) => e.id);
  };

  const insertItens = (option: Option) => {
    const updatedSelectedOptions = selectedOptions
      .map((e) => e.name)
      .includes(option.name)
      ? selectedOptions.filter((option) => option.name !== option.name)
      : [...selectedOptions, option];

    return convertToDeleteAndToInsert(updatedSelectedOptions);
  };

  const deleteItens = (option: Option) => {
    const updatedSelectedOptions = selectedOptions.filter(
      (item) => item.name !== option.name
    );
    return convertToDeleteAndToInsert(updatedSelectedOptions);
  };

  useEffect(() => {
    if (getValues(fieldName)) {
      setSelectedOptions(getValues(fieldName));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  }, [isDropDownVisible]);

  const handleChangeInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    const qToLower = q.toLowerCase();
    setQuery(q);

    if (q !== '') {
      const res = await fetch(`${routeToSearch}?q=${qToLower}`);
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
        <div
          className={classnames(styles.selectButton, {
            [styles.visible]: isDropDownVisible
          })}
          onClick={() => setIsDropDownVisible(!isDropDownVisible)}
        >
          {selectButtonLabel()}
          <i
            className={classnames(styles.chevronDown, {
              [styles.visible]: isDropDownVisible
            })}
          >
            <BsChevronDown />
          </i>
        </div>
        {isDropDownVisible && (
          <>
            {selectedOptions.length > 0 && (
              <ul className={styles.selectedItensBox}>
                {selectedOptions.map((item) => (
                  <Controller
                    key={item.id}
                    control={control}
                    name={fieldName}
                    render={({ field }) => (
                      <li className={styles.selectedItem}>
                        {item.name}
                        <span
                          className={styles.removeItemButton}
                          onClick={() => {
                            toggleOption(item);
                            field.onChange(deleteItens(item));
                          }}
                        >
                          x
                        </span>
                      </li>
                    )}
                  />
                ))}
              </ul>
            )}
            <ul className={styles.options}>
              <SearchBar
                list={options.map((e) => e.name)}
                search={query}
                setSearch={setQuery}
                handleChangeInput={handleChangeInput}
              />
              {filteredData.length > 0 ? (
                <>
                  {filteredData.map((item) => (
                    <Controller
                      key={item.name}
                      control={control}
                      name={fieldName}
                      render={({ field }) => (
                        <div className={styles.inputContainer}>
                          <li
                            className={classnames(styles.option, {
                              checked: selectedOptions.includes(item)
                            })}
                            onClick={() => {
                              toggleOption(item);
                              field.onChange(insertItens(item));
                            }}
                          >
                            <span className={styles.checkbox}>
                              {selectedOptions.includes(item) && (
                                <i className={styles.checkIcon}>
                                  <BsCheckLg />
                                </i>
                              )}
                            </span>
                            <i className={styles.optionIcon} />
                            <span className={styles.optionText}>
                              {item.name}
                            </span>
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
          </>
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
