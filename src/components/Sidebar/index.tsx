import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AiOutlineHome, AiOutlineSearch } from 'react-icons/ai';
import { BiLeftArrowAlt, BiUserPlus } from 'react-icons/bi';
import { LiaUserCogSolid } from 'react-icons/lia';
import { PiNotePencilDuotone } from 'react-icons/pi';

import styles from './styles.module.scss';

import { useGlobalContext } from '@/context/globalContext';
export function Sidebar() {
  const { showNav, setShowNav } = useGlobalContext();
  const [isDesktop, setIsDesktop] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      const isDesktop =
        window.innerWidth > 1024 &&
        window.matchMedia('(min-width: 1024px)').matches;

      setIsDesktop(isDesktop);
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isDesktop, setIsDesktop]);

  return (
    <>
      <div className={`${styles.sidenav} ${showNav ? '' : styles.collapsed}`}>
        <header>
          <div className={styles.logoContainer}>
            <Image
              src="/brasao-ciap-com-background.png"
              width={53}
              height={75}
              alt="Brasão do CIAP"
            />
            <span>CIAP</span>
          </div>
          <div
            onClick={() => setShowNav(!showNav)}
            className={styles.collapseButton}
          >
            <BiLeftArrowAlt className={styles.icon} />
          </div>
        </header>
        <nav>
          <ul onClick={isDesktop ? undefined : () => setShowNav(false)}>
            <li className={`${pathname === '/' ? styles.active : ''}`}>
              <Link href="/">
                <AiOutlineHome className={styles.navIcon} />
                <span>Home</span>
              </Link>
            </li>
            <li
              className={`${
                pathname === '/SearchClients' ? styles.active : ''
              }`}
            >
              <Link href="/SearchClients">
                <AiOutlineSearch className={styles.navIcon} />
                <span>Pesquisar atendidos</span>
              </Link>
            </li>
            <li
              className={`${
                pathname === '/RegisterClient/Options' ? styles.active : ''
              }`}
            >
              <Link href="/RegisterClient/Options">
                <BiUserPlus className={styles.navIcon} />
                <span>Cadastrar atendido</span>
              </Link>
            </li>
            <li
              className={`${
                pathname === '/RegisterAppointment' ? styles.active : ''
              }`}
            >
              <Link href="/RegisterAppointment">
                <PiNotePencilDuotone className={styles.navIcon} />
                <span>Registrar atendimento</span>
              </Link>
            </li>
            <li className={`${pathname === '/Settings' ? styles.active : ''}`}>
              <Link href="/RegisterUser">
                <LiaUserCogSolid className={styles.navIcon} />
                <span>Cadasrar usuário</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
