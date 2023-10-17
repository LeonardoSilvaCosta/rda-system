'use client';

import { useState } from 'react';
import { BsSearch } from 'react-icons/bs';

import styles from './styles.module.scss';

import { ClientCardType } from '@/types/types';

interface SearchBarProps {
  list: string[] | ClientCardType[];
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  variation?: 'home';
}

export function SearchBar({ variation, search, setSearch }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (value: string) => {
    setSearch(value);
  };

  const handleClick = () => {
    setSearch('');
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <div
      className={`${styles.container} ${variation ? styles.home : ''} ${
        isFocused ? styles.focused : ''
      }`}
    >
      <BsSearch className={styles.searchIcon} onClick={handleClick} />
      <input
        value={search}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={handleFocus}
      />
    </div>
  );
}
