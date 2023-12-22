import { useEffect, useState } from 'react';

import styles from './styles.module.scss';

interface PaginationItemProps {
  number: number;
  isCurrent?: boolean;
  onPageChange: (page: number) => void;
}

export function PaginationItem({
  isCurrent = false,
  number,
  onPageChange
}: PaginationItemProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  {
    if (isCurrent) {
      return isLoading ? (
        <p></p>
      ) : (
        <div className={`${styles.number} ${styles.active}`}>{number}</div>
      );
    }
  }

  return isLoading ? (
    <p></p>
  ) : (
    <div className={styles.number} onClick={() => onPageChange(number)}>
      {number}
    </div>
  );
}
