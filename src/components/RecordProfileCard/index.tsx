import { useRouter } from 'next/navigation';

import styles from './styles.module.scss';

import { Dependent, KeyValue, PolicyHolder } from '@/types/types';

interface ProfileCardProps {
  title: string;
  keyValues: KeyValue | KeyValue[];
  policyHolder?: PolicyHolder | null;
  dependents?: Dependent[] | null;
  numberToSlice: number;
  maxItems: number;
}

export function RecordProfileCard({
  title,
  keyValues,
  policyHolder,
  dependents,
  numberToSlice,
  maxItems
}: ProfileCardProps) {
  const router = useRouter();
  const handleClick = (cpf: string | undefined | null) => {
    router.push(`/Record?cpf=${cpf}`);
  };
  const getColumns = (array: KeyValue[], numberToSlice: number) => {
    const noEmptyArray = array.filter((e) => e && e.value !== '');
    if (array.length > numberToSlice) {
      const firstArray = noEmptyArray.slice(0, numberToSlice);
      const secondArray = noEmptyArray.slice(numberToSlice, maxItems);

      return [firstArray, secondArray];
    } else {
      return [array, []];
    }
  };

  const [firstColumn, secondColumn] = Array.isArray(keyValues)
    ? getColumns(keyValues, numberToSlice)
    : [[keyValues], []];

  const isLinkTitle = (title: string) => {
    switch (title) {
      case 'Vínculos cadastrados':
        return true;
      case 'Titular':
        return true;
      default:
        return false;
    }
  };

  const generateColumns = (
    title: string,
    firstColumn: KeyValue[],
    secondColumn: KeyValue[],
    handleClick: (cpf: string | undefined | null) => void
  ) => {
    const getCpfOnHandleClick = (element: KeyValue) => {
      if (element.key === 'Titular' && policyHolder?.cpf) {
        return handleClick(policyHolder.cpf);
      } else if (element.key === 'Dependentes' && dependents) {
        return handleClick(
          dependents.length > 0
            ? dependents.find((e) => e.cpf && element.value.includes(e.cpf))
                ?.cpf
            : undefined
        );
      } else {
        return undefined;
      }
    };
    return (
      <>
        <div className={styles.contentColumn}>
          {firstColumn.map((e) =>
            title === 'Vínculos cadastrados' || title === 'Titular' ? (
              <span
                key={e.value}
                onClick={() => getCpfOnHandleClick(e)}
              >{`${e.value}`}</span>
            ) : (
              <span key={e.value}>{`${e.key}: ${e.value}`}</span>
            )
          )}
        </div>
        <div className={`${styles.contentColumn}`}>
          {secondColumn.map((e) =>
            title === 'Vínculos cadastrados' || title === 'Titular' ? (
              <span
                key={e.value}
                onClick={() => getCpfOnHandleClick(e)}
              >{`${e.value}`}</span>
            ) : (
              <span key={e.value}>{`${e.key}: ${e.value}`}</span>
            )
          )}
        </div>
      </>
    );
  };

  return (
    <main className={styles.container}>
      <header>
        <span>{title}</span>
      </header>
      <div
        className={`${styles.columns} ${isLinkTitle(title) ? styles.link : ''}`}
      >
        {generateColumns(title, firstColumn, secondColumn, handleClick)}
      </div>
    </main>
  );
}
