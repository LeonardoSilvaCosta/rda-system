import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CSSProperties, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { FcMenu } from 'react-icons/fc';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import ClipLoader from 'react-spinners/ClipLoader';
import 'react-loading-skeleton/dist/skeleton.css';

import styles from './styles.module.scss';

import { useGlobalContext } from '@/context/globalContext';
import { useRegisterAppointmentContext } from '@/context/registerAppointmentContext';
import { useRegisterClientContext } from '@/context/registerClientContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface HeaderProps {
  title?: string;
}

const override: CSSProperties = {
  display: 'flex',
  margin: '0 auto',
  alignItems: 'center',
  justifyContent: 'center'
};

export function Header({ title = '' }: HeaderProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const { currentUser, showNav, setShowNav, isLoading } = useGlobalContext();
  const [isExiting, setIsExiting] = useState(false);
  const [showDropDownMenu, setShowDropDownMenu] = useState(false);
  const { returnToDashboard } = useGlobalContext();
  const { goToPreviousStep: previousRegisterClientStep } =
    useRegisterClientContext();
  const { goToPreviousStep: previousRegisterAppointmentStep } =
    useRegisterAppointmentContext();

  const hasTopArrow =
    title === 'Cadastrar atendido' ||
    title === 'Registrar atendimento' ||
    title === 'Cadastrar usuário';

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
    setIsExiting(true);
    await supabase.auth.signOut();
    setIsExiting(false);
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
          {isLoading ? (
            <></>
          ) : (
            <>
              {currentUser.rank && (
                <>
                  <Image
                    src={
                      currentUser.avatar
                        ? currentUser.avatar
                        : '/default-user.svg'
                    }
                    alt="profile-photo"
                    width={40}
                    height={40}
                  />
                  <span>{`${currentUser.rank} ${currentUser.cadre} ${currentUser.nickname}`}</span>
                  <BsChevronDown
                    className={styles.dropdownIcon}
                    onClick={() => {
                      setShowDropDownMenu(!showDropDownMenu);
                    }}
                  />
                </>
              )}
            </>
          )}
          {showDropDownMenu ? (
            <div className={styles.dropdown}>
              <ul>
                <li onClick={handleSignOut}>
                  {isExiting ? (
                    <ClipLoader
                      color={'#EBECF9'}
                      loading={isExiting}
                      cssOverride={override}
                      size={20}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  ) : (
                    'Sair'
                  )}
                </li>
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
