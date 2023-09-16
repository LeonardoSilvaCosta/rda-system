import styles from './styles.module.scss';

interface ButtonProps extends HTMLButtonElement {
  name: string;
  icon?: string;
}

export function Button({ name, type }: ButtonProps) {
  return (
    <button type={type} className={styles.button}>{name}</button>
  )
}