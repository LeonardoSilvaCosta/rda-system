import styles from './styles.module.scss';
import { MdOutlineArrowBackIosNew } from 'react-icons/md'
export function Header() {
  return (
    <nav className={styles.container}>
      <div className={styles.leftInfo}>
        <MdOutlineArrowBackIosNew className={styles.topArrow} />
        <span>RDA</span>
      </div>
    </nav>
  )
}