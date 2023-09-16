"use client"

import { useState } from "react";

import styles from './styles.module.scss';

interface DropdownProps {
  id: string,
  title: string,
}

type Option = {
  name: string;
  value: string;
}

export function DropDown({ id, title }: DropdownProps) {
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);

  const [itemsList, setItemsList] = useState<Option[]>([{ name: "Charles", value: "VC Charles" }, { name: "Landerson", value: "Vc Landerson" }])

  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  return (
    <div className={styles.dropdownContainer}>
      <label htmlFor={id}>{title}</label>
      <div
        className={`${styles.dropdownSelect} ${isDropDownVisible ? styles.visible : ''}`}
        onClick={() => {
          setIsDropDownVisible(!isDropDownVisible);
        }}>
        {selectedItemIndex !== null ? itemsList[selectedItemIndex].name : "Selecione uma opção"}
      </div>
      {
        isDropDownVisible ? (
          <div className={styles.itemsHolder}>
            {
              itemsList.map((item, index) => (
                <div
                  key={item.name}
                  className={styles.dropdownItem}
                  onClick={() => {
                    setSelectedItemIndex(index);
                    setIsDropDownVisible(false);
                  }}
                >
                  {item.name}
                </div>
              ))
            }
          </div>
        ) : <></>
      }
    </div>
  )
}