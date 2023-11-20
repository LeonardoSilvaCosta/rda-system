'use client';
import { CSSProperties } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

import styles from './styles.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  name: string;
  disabled?: boolean;
  isSubmitting?: boolean;
}

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto'
};

export function Button({
  type,
  name,
  disabled = false,
  onClick,
  isSubmitting = false
}: ButtonProps) {
  return (
    <button
      type={type}
      className={styles.button}
      onClick={(e) => onClick && onClick(e)}
      disabled={disabled}
    >
      {isSubmitting ? (
        <ClipLoader
          color={'#EBECF9'}
          loading={isSubmitting}
          cssOverride={override}
          size={24}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        name
      )}
    </button>
  );
}
