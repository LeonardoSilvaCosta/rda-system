import Image from 'next/image';

import styles from './styles.module.scss';

interface RecordHeaderProps {
  buttonTitle: string;
  avatar: string | null;
  fullname: string;
  handleClick: () => void;
}

export function RecordHeader({
  buttonTitle,
  avatar,
  fullname,
  handleClick
}: RecordHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.firstColumn}>
        <Image
          src={avatar ? avatar : '/default-user.svg'}
          alt="avatar"
          width={100}
          height={100}
        />
        <span>{fullname}</span>
      </div>
      <div className={styles.secondColumn} onClick={handleClick}>
        <button type="button">{buttonTitle}</button>
      </div>
    </header>
  );
}
