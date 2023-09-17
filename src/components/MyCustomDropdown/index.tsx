"use client"
import { useState } from 'react';
import styles from './styles.module.scss';

import { BsChevronDown } from "react-icons/bs";

interface MyCustomDropdonwProps {
  title: string,
  text: string,
}

type Option = {
  name: string;
  value: string;
}

export function MyCustomDropdown({ title, text }: MyCustomDropdonwProps) {
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);

  const [itemsList, setItemsList] = useState<Option[]>([
    { name: "Charles", value: "VC Charles" },
    { name: "Landerson", value: "VC Landerson" },
    { name: "Mário", value: "VC Mário" }
  ])

  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  return (
    <div className={styles.dropdownContainer}>
      <label htmlFor={title}>{title}</label>
      <div
        className={`${styles.selectMenu} ${isDropDownVisible ? styles.visible : ''}`}
        onClick={() => { setIsDropDownVisible(!isDropDownVisible); }}
      >
        <div className={styles.selectButton}>
          {selectedItemIndex !== null ? itemsList[selectedItemIndex].name : <span>Selecione uma opção</span>}
          <BsChevronDown className={`${styles.chevronDown} ${isDropDownVisible ? styles.visible : '' }`} />
        </div>
        {
          isDropDownVisible ? (
            <ul className={styles.options}>
              {
                itemsList.map((item, index) => (
                  <>
                    <li
                      key={item.name}
                      className={styles.option}
                      onClick={() => {
                        setSelectedItemIndex(index);
                        setIsDropDownVisible(false);
                      }}
                    >
                      <i className={styles.optionIcon} />
                      <span className={styles.optionText}>{item.name}</span>
                    </li>
                  </>
                ))
              }
            </ul>
          ) : <></>
        }
      </div>
    </div>
  )
}