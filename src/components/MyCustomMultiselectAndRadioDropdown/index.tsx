import React, { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import classnames from 'classnames';
import styles from './styles.module.scss';
import { BsChevronDown, BsCheckLg } from "react-icons/bs";
import { Control, Controller, FieldError, FieldErrors, FieldPath, FieldValues, Path, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { Option, Referral } from '@/types/types';
import { SearchBar } from '../SearchBar';

interface MyCustomMultiselectAndRadioDropdownProps<T extends FieldValues> {
  title: string;
  fieldname: FieldPath<T>;
  getValues: UseFormGetValues<any>;
  setValue: UseFormSetValue<any>;
  firstOptions: Option[];
  secondOptions: Option[];
  control: Control<T>;
  errors: FieldErrors<T>;
}

export function MyCustomMultiSelectAndRadioDropdown<T extends FieldValues>({ title, fieldname, getValues, setValue, firstOptions, secondOptions, control, errors }: MyCustomMultiselectAndRadioDropdownProps<T>) {
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [selectedSecondOptionsForFirstOption, setSelectedSecondOptionsForFirstOption] = useState<Record<string, Option[]>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");

  const errorKey = fieldname as string;

  const isNested = fieldname.includes('.');

  const nestedFields = isNested ? fieldname.split('.') : [];
  const topLevelField = isNested ? nestedFields[0] : fieldname;

  const lowerSearch = search.toLocaleLowerCase();

  const filteredList = firstOptions.filter((item) =>
    item.name
      .toLocaleLowerCase()
      .includes(lowerSearch));

  const closeDropdown = () => {
    setIsDropDownVisible(false);
  };

  const validate = () => {
    const hasFirstOptionWithoutSecondOption = selectedOptions.some(option => {
      const secondOptions = selectedSecondOptionsForFirstOption[option.id];
      return !secondOptions || secondOptions.length === 0;
    });

    return hasFirstOptionWithoutSecondOption;
  }

  useEffect(() => {
    setValue('hasFirstOptionWithoutSecondOption', validate())
  }, [selectedOptions, selectedSecondOptionsForFirstOption])

  const toggleFirstOption = (option: Option) => {
    const isOptionSelected = selectedOptions.some((selectedOption) => selectedOption.name === option.name);

    if (isOptionSelected) {
      setSelectedOptions(selectedOptions.filter((item) => item.name !== option.name));
      setSelectedSecondOptionsForFirstOption((prevSelectedSecondOptions) => {
        const updatedSecondOptions = { ...prevSelectedSecondOptions };
        delete updatedSecondOptions[option.id];
        deleteSecondOptionsItens(option);
        return updatedSecondOptions;
      });
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

  const convertSecondOptionToInsert = (selectedSecondOptionsForFirstOption: Record<string, Option[]>) => {
    const firstOptionsId = selectedOptions.map(firstOption => firstOption.id);

    const arrayWithFirstOptionIdAndSecondOptionId = firstOptionsId.flatMap((firstOptionId: string) => {
      const secondOptions = selectedSecondOptionsForFirstOption[firstOptionId] || [];

      return secondOptions.map((secondOption) => {
        return {
          firstOptionId: firstOptionId,
          secondOptionId: secondOption.id,
        };
      });
    });

    return arrayWithFirstOptionIdAndSecondOptionId;
  }

  const insertSecondOptionsItens = (secondOption: Option, firstOptionId: string) => {
    const currentSelections = selectedSecondOptionsForFirstOption[firstOptionId] || [];

    if (currentSelections.map(e => e.id).includes(secondOption.id)) {
      return convertSecondOptionToInsert(
        {
          ...selectedSecondOptionsForFirstOption,
          [firstOptionId]: currentSelections.filter((item) => item.name !== secondOption.name),
        }
      );
    } else {
      return convertSecondOptionToInsert(
        {
          ...selectedSecondOptionsForFirstOption,
          [firstOptionId]: [...currentSelections, secondOption],
        }
      )
    }
  };

  const deleteSecondOptionsItens = (firstOption: Option) => {
    const fieldValues = getValues(fieldname) as Referral[] | undefined;

    if (fieldValues) {
      const updatedValues = fieldValues.filter((referral) => referral.firstOptionId !== firstOption.id);
      setValue(fieldname as string, updatedValues);
    }
  };

  useEffect(() => {
    if (getValues(fieldname)) {
      const preReferrals: { firstOptionId: string, secondOptionId: string }[] = getValues(fieldname);

      const preSelectedFirstOptions: Option[] = firstOptions.filter((e) => preReferrals.some((item) => item.firstOptionId === e.id));

      const preSelectedSecondOptionsForFirstOption: Record<string, Option[]> = {};

      preReferrals.forEach((item) => {
        const secondOptionSelected = secondOptions.find((e) => e.id === item.secondOptionId);

        if (secondOptionSelected) {
          if (!preSelectedSecondOptionsForFirstOption[item.firstOptionId]) {
            preSelectedSecondOptionsForFirstOption[item.firstOptionId] = [];
          }

          preSelectedSecondOptionsForFirstOption[item.firstOptionId].push({
            id: secondOptionSelected.id,
            name: secondOptionSelected.name,
          });
        }
      });

      setSelectedOptions((prevOptions) => [...prevOptions, ...preSelectedFirstOptions]);
      setSelectedSecondOptionsForFirstOption((prevSecondOptions) => {
        const updatedSecondOptions = { ...prevSecondOptions };
        for (const key in preSelectedSecondOptionsForFirstOption) {
          if (updatedSecondOptions[key]) {
            updatedSecondOptions[key].push(...preSelectedSecondOptionsForFirstOption[key]);
          } else {
            updatedSecondOptions[key] = preSelectedSecondOptionsForFirstOption[key];
          }
        }
        return updatedSecondOptions;
      });
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
        {isDropDownVisible && (
          <>
            {selectedOptions.length > 0 && (
              <ul className={styles.selectedItensBox}>
                {selectedOptions.map((item) => (
                  <div key={item.id}>
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
                        }}
                      >x</span>
                    </li>
                  </div>
                ))}
              </ul>
            )}
            <ul className={styles.options}>
              <SearchBar list={firstOptions.map(e => e.name)} search={search} setSearch={setSearch} />
              {filteredList.map((item) => (
                <div key={item.name}>
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
                        name={fieldname}
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
                </div>
              ))}
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
            {(errors[topLevelField] as Record<string, FieldError>)[nestedFields[1]]?.message}
          </span>
        )}
      </div>
    </div>
  );
}
