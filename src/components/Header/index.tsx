import styles from './styles.module.scss';
import { MdOutlineArrowBackIosNew } from 'react-icons/md'

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header>
      <div className={styles.leftItemContainer}>
        <div className={styles.leftItem}>
          <MdOutlineArrowBackIosNew className={styles.topArrow} />
          <span>{title}</span>
        </div>
      </div>
    </header>
  )
}