import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import styles from './styles.module.scss';
import { BsChevronDown, BsCheckLg } from "react-icons/bs";
import { Control, Controller, FieldError, FieldErrors, FieldPath, FieldValues, Path, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { Option } from '@/types/types';
import { SearchBar } from '../SearchBar';

interface MyCustomMultiselectAndRadioDropdownProps<T extends FieldValues> {
  title: string;
  firstFieldName: FieldPath<T>;
  secondFieldName: FieldPath<T>;
  getValues: UseFormGetValues<any>;
  setValue: UseFormSetValue<any>;
  firstOptions: Option[];
  secondOptions: Option[];
  control: Control<T>;
  errors: FieldErrors<T>,
}

export function MyCustomMultiSelectAndRadioDropdown<T extends FieldValues>({ title, firstFieldName, secondFieldName, getValues, setValue, firstOptions, secondOptions, control, errors }: MyCustomMultiselectAndRadioDropdownProps<T>) {
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [selectedSecondOptionsForFirstOption, setSelectedSecondOptionsForFirstOption] = useState<Record<string, Option[]>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");

  const errorKey = firstFieldName as string;

  const isNested = firstFieldName.includes('.');

  const nestedFields = isNested ? firstFieldName.split('.') : [];
  const topLevelField = isNested ? nestedFields[0] : firstFieldName;

  const lowerSearch = search.toLocaleLowerCase();

  const filteredList = firstOptions.filter((item) =>
    item.name
      .toLocaleLowerCase()
      .includes(lowerSearch));

  const closeDropdown = () => {
    setIsDropDownVisible(false);
  };

  const toggleFirstOption = (option: Option) => {
    if (selectedOptions.some((selectedOption) => selectedOption.name === option.name)) {
      const updatedSelectedOptions = selectedOptions.filter((item) => item.name !== option.name);
      const updatedSelectedFirstOptions = { ...selectedSecondOptionsForFirstOption };
      delete updatedSelectedFirstOptions[option.id];
      setSelectedSecondOptionsForFirstOption(updatedSelectedFirstOptions);
      deleteSecondOptionsItens(option);

      setSelectedOptions(updatedSelectedOptions);
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const toggleSecondOption = (secondOption: Option, itemId: string) => {
    const currentSelections = selectedSecondOptionsForFirstOption[itemId] || [];

    if (currentSelections.map(e => e.id).includes(secondOption.id)) {
      setSelectedSecondOptionsForFirstOption({
        ...selectedSecondOptionsForFirstOption,
        [itemId]: currentSelections.filter((item) => item.name !== secondOption.name),
      });
    } else {
      setSelectedSecondOptionsForFirstOption({
        ...selectedSecondOptionsForFirstOption,
        [itemId]: [...currentSelections, secondOption],
      });
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

  const insertFirstOptionsItens = (firstOption: Option) => {
    const updatedSelectedOptions = selectedOptions.some((selectedOption) => selectedOption.name === firstOption.name)
      ? selectedOptions.filter((selectedOption) => selectedOption.name !== firstOption.name)
      : [...selectedOptions, firstOption];

    return updatedSelectedOptions;
  };

  const insertSecondOptionsItens = (secondOption: Option, firstOptionId: string) => {
    const currentSelections = selectedSecondOptionsForFirstOption[firstOptionId] || [];

    if (currentSelections.map(e => e.id).includes(secondOption.id)) {
      return {
        ...selectedSecondOptionsForFirstOption,
        [firstOptionId]: currentSelections.filter((item) => item.name !== secondOption.name),
      };
    } else {
      return {
        ...selectedSecondOptionsForFirstOption,
        [firstOptionId]: [...currentSelections, secondOption],
      };
    }
  };

  const deleteFirstOptionsItens = (firstOption: Option) => {
    const updatedSelectedOptions = selectedOptions.filter((item) => item.name !== firstOption.name);
    return updatedSelectedOptions;
  }

  const deleteSecondOptionsItens = (firstOption: Option) => {
    if (selectedOptions.some((selectedOption) => selectedOption.name === firstOption.name)) {
      setValue(secondFieldName as string, []);
    }
  }


  useEffect(() => {
    if (getValues(firstFieldName)) {
      setSelectedOptions(getValues(firstFieldName))
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
          <span className="error-message">
            {String(errors[errorKey]?.message)}
          </span>
        )}
        {isNested && nestedFields.length === 2 && errors[topLevelField] && (
          <span className="error-message">
            {(errors[topLevelField] as Record<string, FieldError>)[nestedFields[1]]?.message}
          </span>
        )}
        {isDropDownVisible && (
          <>
            {selectedOptions.length > 0 && (
              <ul className={styles.selectedItensBox}>
                {selectedOptions.map((item) => (
                  <Controller
                    key={item.id}
                    control={control}
                    name={firstFieldName}
                    render={({ field }) => (
                      <li
                        className={styles.selectedItem}
                      >
                        {selectedSecondOptionsForFirstOption[item.id] && selectedSecondOptionsForFirstOption[item.id].length > 0
                          ? `${item.name} - ${selectedSecondOptionsForFirstOption[item.id].map(e => e.name).join(', ')}`
                          : `${item.name}`
                        }
                        <span
                          className={styles.removeItemButton}
                          onClick={() => {
                            toggleFirstOption(item);
                            field.onChange(deleteFirstOptionsItens(item));
                          }}
                        >x</span>
                      </li>
                    )}
                  />
                ))}
              </ul>
            )}
            <ul className={styles.options}>
              <SearchBar list={firstOptions.map(e => e.name)} search={search} setSearch={setSearch} />
              {filteredList.map((item) => (
                <Controller
                  key={item.name}
                  control={control}
                  name={firstFieldName}
                  render={({ field }) => (
                    <div className={styles.inputContainer}>
                      <li
                        className={classnames(styles.option, {
                        })}
                      >
                        <div className={classnames(styles.firstOptions, {
                          checked: selectedOptions.includes(item),
                        })}
                          onClick={() => {
                            toggleFirstOption(item);
                            field.onChange(insertFirstOptionsItens(item));
                          }}
                        >
                          <span className={styles.checkbox}>
                            {selectedOptions.includes(item) && (
                              <i className={styles.checkIcon}><BsCheckLg /></i>
                            )}
                          </span>
                          <i className={styles.optionIcon} />
                          <span className={styles.optionText}>{item.name}</span>
                        </div>
                        <Controller
                          key={item.name}
                          control={control}
                          name={secondFieldName}
                          render={({ field }) => (
                            <div className={classnames(styles.secondOptions)}>
                              {secondOptions.map((e) => (
                                <div key={e.id} className={classnames(styles.secondCheckboxesWrapper, {
                                  checked: selectedSecondOptionsForFirstOption[item.id]?.map(e => e.name).includes(e.name),
                                })}
                                  onClick={() => {
                                    if (selectedOptions.some((selectedItem) => selectedItem.id === item.id)) {
                                      toggleSecondOption(e, item.id);
                                      field.onChange(insertSecondOptionsItens(e, item.id));
                                    }
                                  }}
                                >
                                  <span className={styles.checkbox}>
                                    {selectedSecondOptionsForFirstOption[item.id]?.map(e => e.name).includes(e.name) && (
                                      <i className={styles.checkIcon}><BsCheckLg /></i>
                                    )}
                                  </span>
                                  <span className={styles.optionText}>{e.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        />
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
