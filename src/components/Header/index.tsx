import { usePathname, useRouter } from 'next/navigation';
import styles from './styles.module.scss';
import { MdOutlineArrowBackIosNew } from 'react-icons/md'
import { useGlobalContext } from '@/context/globalContext';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { headerClickRoute } = useGlobalContext();
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    router.push(headerClickRoute);
  }

  return (
    <header className={`${styles.container} ${pathname === '/' ? styles.home : '' }`}>
      <div className={`${styles.leftItemWrapper}`}>
        <div className={`${styles.leftItem}`}>
          <MdOutlineArrowBackIosNew
            className={`${styles.topArrow} ${pathname === '/' ? styles.home : '' }`}
            onClick={handleClick}
          />
          <span>{title}</span>
        </div>
      </div>
    </header>
  )
}