import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { FcMenu } from 'react-icons/fc';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';

import styles from './styles.module.scss';

import { useGlobalContext } from '@/context/globalContext';
import { useRegisterAppointmentContext } from '@/context/registerAppointmentContext';
import { useRegisterClientContext } from '@/context/registerClientContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface HeaderProps {
  title?: string;
}

export function Header({ title = '' }: HeaderProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const { showNav, setShowNav } = useGlobalContext();
  const [showDropDownMenu, setShowDropDownMenu] = useState(false);
  const { returnToDashboard } = useGlobalContext();
  const { goToPreviousStep: previousRegisterClientStep } =
    useRegisterClientContext();
  const { goToPreviousStep: previousRegisterAppointmentStep } =
    useRegisterAppointmentContext();

  const hasTopArrow =
    title === 'Cadastrar atendido' || title === 'Registrar atendimento';

  const handleClick = () => {
    switch (title) {
      case 'Prontuário':
        returnToDashboard();
        break;
      case 'Cadastrar atendido':
        previousRegisterClientStep();
        break;
      case 'Registrar atendimento':
        previousRegisterAppointmentStep();
        break;
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <main
      className={`${styles.wrapper} ${title === 'Home' ? styles.home : ''}`}
    >
      <header className={styles.container}>
        <div className={`${styles.leftColumn}`}>
          <div className={`${styles.leftContent}`}>
            <MdOutlineArrowBackIosNew
              className={`${styles.topArrow} ${
                !hasTopArrow ? styles.home : ''
              }`}
              onClick={handleClick}
            />
            {!hasTopArrow && (
              <FcMenu
                onClick={() => setShowNav(!showNav)}
                className={`${styles.menuIcon}`}
              />
            )}
            <span>{title}</span>
          </div>
        </div>
        <div className={styles.rightColumn}>
          <Image
            src="/profile.png"
            alt="profile-photo"
            width={40}
            height={40}
          />
          <span>1º TEN QCOPM LEONARDO</span>
          <BsChevronDown
            className={styles.dropdownIcon}
            onClick={() => {
              setShowDropDownMenu(!showDropDownMenu);
            }}
          />
          {showDropDownMenu ? (
            <div className={styles.dropdown}>
              <ul>
                <li>Editar perfil</li>
                <li onClick={handleSignOut}>Sair</li>
              </ul>
            </div>
          ) : (
            <></>
          )}
        </div>
      </header>
    </main>
  );
}
