import { FaChevronLeft } from 'react-icons/fa';
import { FaChevronRight } from 'react-icons/fa6';

import styles from './styles.module.scss';

export function PaginationComponent() {
  return (
    <main className={styles.container}>
      <div className={styles.leftButton}>
        <FaChevronLeft />
        <span>Anterior</span>
      </div>
      <div className={styles.numbers}>
        <span className={styles.active}>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
        <span>6</span>
      </div>
      <div className={styles.rightButton}>
        <span>Posterior</span>
        <FaChevronRight />
      </div>
    </main>
  );
}
