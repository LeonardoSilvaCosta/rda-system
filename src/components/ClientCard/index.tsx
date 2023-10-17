import Image from 'next/image';
import { useRouter } from 'next/navigation';

import styles from './styles.module.scss';

interface ClientCardProps {
  avatar?: string;
  fullname: string;
  rank: string;
  cadre: string;
  rg: string;
  nickname: string;
  cpf: string;
}

export function ClientCard({
  avatar = '/default-user.svg',
  fullname,
  rank,
  cadre,
  rg,
  nickname,
  cpf
}: ClientCardProps) {
  return (
    <div className={styles.container}>
      <div>
        <Image src={avatar} width="60" height="60" alt="profile" />
      </div>
      <div className={styles.textBox}>
        <p>{fullname}</p>
        <div className={styles.textFooter}>
          {rg && <p> {`${rank} ${cadre} ${rg} ${nickname}`}</p>}
          <p>{cpf}</p>
        </div>
      </div>
    </div>
  );
}
