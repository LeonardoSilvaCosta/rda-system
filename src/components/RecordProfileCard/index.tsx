import { useRouter } from 'next/navigation';

import styles from './styles.module.scss';

interface ProfileCardProps {
  title: string;
  keyValues: CardValue[];
  numberToSlice: number;
}

type CardValue = {
  key: string;
  value: string;
};

export function RecordProfileCard({
  title,
  keyValues,
  numberToSlice
}: ProfileCardProps) {
  const router = useRouter();
  const handleClick = (cpf: string) => {
    router.push(`/RecordProfile?cpf=${cpf}`);
  };
  const getColumns = (array: CardValue[], numberToSlice: number) => {
    const noEmptyArray = array.filter((e) => e.value !== '');
    if (array.length > numberToSlice) {
      const firstArray = noEmptyArray.slice(0, numberToSlice);
      const secondArray = noEmptyArray.slice(numberToSlice);

      return [firstArray, secondArray];
    } else {
      return [array, []];
    }
  };

  const [firstColumn, secondColumn] = getColumns(keyValues, numberToSlice);

  return (
    <main className={styles.container}>
      <header>
        <span>{title}</span>
      </header>
      <div
        className={`${styles.columns} ${
          title === 'Vínculos cadastrados' ? styles.link : ''
        }`}
      >
        {title !== 'Vínculos cadastrados' ? (
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
