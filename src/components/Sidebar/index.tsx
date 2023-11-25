import Image from 'next/image';
import { useEffect, useState } from 'react';
import { AiOutlineHome, AiOutlineSearch } from 'react-icons/ai';
import { BiLeftArrowAlt, BiUserPlus } from 'react-icons/bi';
import { LiaUserCogSolid } from 'react-icons/lia';
import { PiNotePencilDuotone } from 'react-icons/pi';

import { SidebarLink } from '../SidebarLink';
import styles from './styles.module.scss';

import { useGlobalContext } from '@/context/globalContext';
export function Sidebar() {
  const { showNav, setShowNav } = useGlobalContext();
  const [isDesktop, setIsDesktop] = useState(true);

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
            <SidebarLink icon={AiOutlineHome} href="/">
              <span>Home</span>
            </SidebarLink>
            <SidebarLink icon={AiOutlineSearch} href="/SearchClients">
              <span>Pesquisar atendidos</span>
            </SidebarLink>
            <SidebarLink icon={BiUserPlus} href="/RegisterClient/Options">
              <span>Cadastrar atendido</span>
            </SidebarLink>
            <SidebarLink
              icon={PiNotePencilDuotone}
              href="/RegisterClient/Options"
            >
              <span>Registrar atendimento</span>
            </SidebarLink>
            <SidebarLink icon={LiaUserCogSolid} href="/RegisterClient/Options">
              <span>Cadastrar usuário</span>
            </SidebarLink>
          </ul>
        </nav>
      </div>
    </>
  );
}
