import { useEffect, useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { FaChevronRight } from 'react-icons/fa6';

import { PaginationItem } from './PaginationItem';
import styles from './styles.module.scss';

interface PaginationComponentProps {
  totalCountOfRegisters: number;
  registersPerPage?: number;
  currentPage?: number;
  onPageChange: React.Dispatch<React.SetStateAction<number>>;
}

const siblingsCount = 1;

function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)]
    .map((_, index) => {
      return from + index + 1;
    })
    .filter((page) => page > 0);
}

export function PaginationComponent({
  totalCountOfRegisters,
  registersPerPage = 10,
  currentPage = 1,
  onPageChange
}: PaginationComponentProps) {
  const lastPage = Math.ceil(totalCountOfRegisters / registersPerPage);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const previousPages =
    currentPage > 1
      ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1)
      : [];

  const nextPages =
    currentPage < lastPage
      ? generatePagesArray(
          currentPage,
          Math.min(currentPage + siblingsCount, lastPage)
        )
      : [];

  if (loading) {
    return <></>;
  }
  return (
    <main className={styles.container}>
      <div
        className={styles.leftButton}
        onClick={
          currentPage - 1 > 0 ? () => onPageChange(currentPage - 1) : undefined
        }
      >
        <FaChevronLeft />
        <span>Anterior</span>
      </div>
      {currentPage > 1 + siblingsCount && (
        <>
          <PaginationItem onPageChange={onPageChange} number={1} />
          {currentPage > 2 + siblingsCount && (
            <span className={styles.paginationPrevItems}>...</span>
          )}
        </>
      )}

      {previousPages.length > 0 &&
        previousPages.map((page) => {
          return (
            <PaginationItem
              onPageChange={onPageChange}
              key={page}
              number={page}
            />
          );
        })}

      <PaginationItem
        onPageChange={onPageChange}
        number={currentPage}
        isCurrent
      />

      {nextPages.length > 0 &&
        nextPages.map((page) => {
          return (
            <PaginationItem
              onPageChange={onPageChange}
              key={page}
              number={page}
            />
          );
        })}

      {currentPage + siblingsCount < lastPage && (
        <>
          {currentPage + 1 + siblingsCount < lastPage && (
            <span className={styles.paginationNextItems}>...</span>
          )}
          <PaginationItem onPageChange={onPageChange} number={lastPage} />
        </>
      )}
      <div
        className={styles.rightButton}
        onClick={
          currentPage + 1 <= lastPage
            ? () => onPageChange(currentPage + 1)
            : undefined
        }
      >
        <span>Posterior</span>
        <FaChevronRight />
      </div>
    </main>
  );
}
