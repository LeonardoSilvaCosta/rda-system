import { IconType } from 'react-icons';
import styles from './styles.module.scss';

interface DashboardButtonProps {
  icon: IconType;
  name: string;
}

export function DashboardButton({ icon: Icon, name }: DashboardButtonProps) {
  return (
    <div className={styles.button}>
      <i><Icon className={styles.icon} /></i>
      <span>{name}</span>
    </div>
  )
}