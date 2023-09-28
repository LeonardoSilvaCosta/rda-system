import Image from 'next/image';
import styles from './styles.module.scss';

interface ClientCardProps {
  fullname: string;
  posto_grad: string;
  cadre: string;
  rg: string;
  nickname: string;
  cpf: string;
}

export function ClientCard({ fullname, posto_grad, cadre, rg, nickname, cpf }: ClientCardProps) {
  return (
    <div className={styles.container}>
      <div>
        <Image
          src="/profile.png"
          width="60"
          height="60"
        alt="profile"
        />
      </div>
      <div className={styles.textBox}>
        <p>{fullname}</p>
        <div className={styles.textFooter}>
          <p>{`${posto_grad} ${cadre} ${rg} ${nickname}`}</p>
          <p>{cpf}</p>
        </div>
      </div>

    </div>
  )
}