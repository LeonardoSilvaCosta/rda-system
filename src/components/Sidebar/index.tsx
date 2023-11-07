import Image from 'next/image';
import { useState } from 'react';
import { AiOutlineHome, AiOutlineSearch } from 'react-icons/ai';
import { BiLeftArrowAlt, BiUserPlus } from 'react-icons/bi';
import { PiNotePencilDuotone } from 'react-icons/pi';
import { RxGear } from 'react-icons/rx';

import styles from './styles.module.scss';
export function Sidebar() {
  const [showNav, setShowNav] = useState(true);

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
          <ul>
            <li>
              <a href="/">
                <AiOutlineHome className={styles.navIcon} />
                <span>Home</span>
              </a>
            </li>
            <li>
              <a href="/RegisterClient/Options">
                <BiUserPlus className={styles.navIcon} />
                <span>Cadastrar atendido</span>
              </a>
            </li>
            <li>
              <a href="/SearchClients">
                <AiOutlineSearch className={styles.navIcon} />
                <span>Pesquisar atendidos</span>
              </a>
            </li>
            <li>
              <a href="/RegisterAppointment">
                <PiNotePencilDuotone className={styles.navIcon} />
                <span>Registrar atendimento</span>
              </a>
            </li>
            <li>
              <a href="/Settings">
                <RxGear className={styles.navIcon} />
                <span>Configurações</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
