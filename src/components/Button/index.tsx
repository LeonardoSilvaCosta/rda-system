'use client'
import styles from './styles.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  name: string;
  disabled?: boolean;
}

export function Button({ type, name, disabled = false, onClick }: ButtonProps) {
  return (
    <button
      type={type}
      className={styles.button}
      onClick={(e) => onClick && onClick(e)}
      disabled={disabled}
    >
      {name}
    </button>
  )
}
