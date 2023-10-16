import { usePathname } from 'next/navigation';
import styles from './styles.module.scss';
import { MdOutlineArrowBackIosNew } from 'react-icons/md'
import { useGlobalContext } from '@/context/globalContext';
import { useRegisterClientContext } from '@/context/registerClientContext';
import { useRegisterAppointmentContext } from '@/context/registerAppointmentContext';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { goToPreviousStep: previousRegisterClientStep } = useRegisterClientContext();
  const { goToPreviousStep: previousRegisterAppointmentStep } = useRegisterAppointmentContext();
  const pathname = usePathname();

  const handleClick = () => {
    switch (pathname) {
      case '/RegisterClient/Form':
        previousRegisterClientStep()
        break;
      case '/RegisterAppointment':
        previousRegisterAppointmentStep()
        break;
    }
  }

  return (
    <header className={`${styles.container} ${pathname === '/' ? styles.home : ''}`}>
      <div className={`${styles.leftItemWrapper}`}>
        <div className={`${styles.leftItem}`}>
          <MdOutlineArrowBackIosNew
            className={`${styles.topArrow} ${pathname === '/' ? styles.home : ''}`}
            onClick={handleClick}
          />
          <span>{title}</span>
        </div>
      </div>
    </header>
  )
}