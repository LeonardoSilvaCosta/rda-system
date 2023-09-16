import { RadioButton } from '../RadioButton';
import styles from './styles.module.scss';

interface RadioGroupProps {
  title: string;
  name: string;
  label1: string;
  label2: string;
}

export function RadioGroup({ title, name, label1, label2 }: RadioGroupProps) {
  return (
    <div className={styles.radioGroup}>
      <label>{title}</label>
      <RadioButton label={label1} name={name} />
      <RadioButton label={label2} name={name} />
    </div>
  )
}