'use client'
import styles from './styles.module.scss';
import { useGlobalContext } from '@/context/form';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  name: string;
  disabled?: boolean;
}

export function Button({ type, name, disabled = false, onClick }: ButtonProps) {
  const { goToPreviousStep, isFirstStep, currentStep } = useGlobalContext();

  // const handleClick = () => {
  //   if (type === "button") {
  //     goToPreviousStep(currentStep);
  //   }
  // }

  return (
    <button
      type={type}
      className={styles.button}
      onClick={(e) => onClick && onClick(e)}
      disabled={disabled}
    >
      {name}
    </button>
  )
}
