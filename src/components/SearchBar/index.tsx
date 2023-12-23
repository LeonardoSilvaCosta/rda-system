'use client';

import { useRef, useState } from 'react';
import { BsSearch } from 'react-icons/bs';

import styles from './styles.module.scss';

import { ClientCardType } from '@/types/types';

interface SearchBarProps {
  list: string[] | ClientCardType[];
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  variation?: 'home';
  handleChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchBar({
  variation,
  search,
  setSearch,
  handleChangeInput
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <div
      ref={searchBarRef}
      className={`${styles.container} ${variation ? styles.home : ''} ${
        isFocused ? styles.focused : ''
      }`}
    >
      <BsSearch className={styles.searchIcon} onClick={handleClick} />
      <input
        type="text"
        value={search}
        onChange={(e) => handleChangeInput(e)}
        onFocus={handleFocus}
        autoComplete="off"
      />
    </div>
  );
}
