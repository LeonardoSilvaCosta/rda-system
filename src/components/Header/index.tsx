import styles from './styles.module.scss';
import { MdOutlineArrowBackIosNew } from 'react-icons/md'
export function Header() {
  return (
    <header>
      <div className={styles.leftItemContainer}>
        <div className={styles.leftItem}>
          <MdOutlineArrowBackIosNew className={styles.topArrow} />
          <span>RDA</span>
        </div>
      </div>
    </header>
  )
}