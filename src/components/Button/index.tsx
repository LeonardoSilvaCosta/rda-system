import styles from './styles.module.scss';

interface ButtonProps {
  name: string;
  icon?: string;
}

export function Button({ name }: ButtonProps) {
  return (
    <button className={styles.button}>{name}</button>
  )
}