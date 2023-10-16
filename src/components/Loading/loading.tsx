import Image from 'next/image';

import styles from './loading.module.scss';

export function LoadingComponent() {
  return (
    <div className={styles.loaderContainer}>
      <Image
        className={styles.loader}
        src="/loading.svg"
        width={100}
        height={100}
        alt="loader"
      />
    </div>
  );
}
