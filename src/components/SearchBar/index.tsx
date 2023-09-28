"use client"

import { ClientCardType } from '@/types/types';
import styles from './styles.module.scss';
import { BsSearch } from "react-icons/bs";
import { useState } from 'react';


interface SearchBarProps {
  list: { value: string }[] | ClientCardType;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  variation?: "home" ;
}

export function SearchBar({ variation, search, setSearch }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (value: string) => {
    setSearch(value);
  }

  const handleFocus = () => {
    setIsFocused(true);
  }

  const handleBlur = () => {
    setSearch("")
    setIsFocused(false);
  }

  return (
    <div className={`${styles.container} ${variation ? styles.home : '' } ${isFocused ? styles.focused : ''}`}>
      <BsSearch className={styles.searchIcon} />
      <input
        value={search}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  )
}