import Image from 'next/image';
import { useRouter } from 'next/navigation';

import styles from './styles.module.scss';

interface RecordHeaderProps {
  buttonTitle: string;
  avatar?: string;
  fullname: string;
  goToRoute?: string;
}

export function RecordHeader({
  buttonTitle,
  avatar,
  fullname,
  goToRoute
}: RecordHeaderProps) {
  const router = useRouter();
  const handleClick = () => {
    if (goToRoute) {
      router.push(`${goToRoute}`);
    } else {
      router.back();
    }
  };
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
