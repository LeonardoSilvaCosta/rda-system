import styles from './styles.module.scss';

interface InputProps {
  title: string,
  type: string,
  hint?: string,
  icon?: string,
  name: string,

}

export function Input({ title, type, hint, name }: InputProps) {
  return (
    <div className={styles.inputContainer}>
      <label htmlFor={name}>{title}</label>
      <input name={name} type={type} placeholder={hint}></input>
    </div>
  )
}