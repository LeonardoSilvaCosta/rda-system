import styles from './styles.module.scss';
import { useGlobalContext } from '@/context/store';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
}


export function Button({ type }: ButtonProps) {
  const { changeStep, currentStep, isFirstStep, isLastStep } = useGlobalContext();

  const handleClick = () => {
    if (type === "button") {
      changeStep(currentStep - 1)
    }
  }

  const buttonName = () => {
    if (isLastStep && type === "submit") {
      return "Enviar"
    } else if (!isLastStep && type === "submit") {
      return "Próxima"
    } else {
      return "Voltar"
    }
  }

  return (
    <button
      type={type}
      className={styles.button}
      onClick={() => handleClick()}
      disabled={isFirstStep && type === "button"}
    >
      {buttonName()}
    </button>
  )
}