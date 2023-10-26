import { useRouter } from 'next/navigation';

import styles from './styles.module.scss';

import { KeyValue } from '@/types/types';

interface ProfileCardProps {
  title: string;
  keyValues: KeyValue[] | KeyValue;
  numberToSlice: number;
  maxItems: number;
}

export function RecordProfileCard({
  title,
  keyValues,
  numberToSlice,
  maxItems
}: ProfileCardProps) {
  const router = useRouter();
  const handleClick = (cpf: string) => {
    router.push(`/Record/Profile?cpf=${cpf}`);
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

  return (
    <main className={styles.container}>
      <header>
        <span>{title}</span>
      </header>
      <div
        className={`${styles.columns} ${isLinkTitle(title) ? styles.link : ''}`}
      >
        {!isLinkTitle(title) ? (
          <>
            <div className={styles.contentColumn}>
              {firstColumn.map((e) => (
                <span key={e.key}>
                  {e.key ? `${e.key}: ${e.value}` : e.value}
                </span>
              ))}
            </div>
            <div className={`${styles.contentColumn}`}>
              {secondColumn.map((e) => (
                <span key={e.key}>
                  {e.key ? `${e.key}: ${e.value}` : e.value}
                </span>
              ))}
            </div>
          </>
        ) : (
          <>
            <div
              className={styles.contentColumn}
              onClick={() => handleClick(keyValues[0].key)}
            >
              {firstColumn.map((e) => (
                <span key={e.key}>{e.value}</span>
              ))}
            </div>
            <div
              className={`${styles.contentColumn}`}
              onClick={() => handleClick(keyValues[0].key)}
            >
              {secondColumn.map((e) => (
                <span key={e.key}>{e.value}</span>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
