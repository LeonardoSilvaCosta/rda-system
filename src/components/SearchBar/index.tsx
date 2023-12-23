'use client';

import { useEffect, useRef, useState } from 'react';
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

  const blurSearchBar = () => {
    setIsFocused(false);
    setSearch('');
  };

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       searchBarRef.current &&
  //       !searchBarRef.current.contains(event.target as Node)
  //     ) {
  //       blurSearchBar();
  //     }
  //   };

  //   if (searchBarRef) {
  //     document.addEventListener('mousedown', handleClickOutside);
  //   } else {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [isFocused]);

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
