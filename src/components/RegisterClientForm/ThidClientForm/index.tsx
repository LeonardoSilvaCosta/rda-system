
import { ClientFormValues, Option } from '@/types/types';
import styles from './styles.module.scss';
import { Control, UseFormRegister, UseFormWatch } from "react-hook-form";
import { Input } from '@/components/Input';
import { MyCustomDropdown } from '@/components/MyCustomDropdown';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';
import { useRegisterClientContext } from '@/context/registerClientContext';
import { useEffect, useState } from 'react';
import { LoadingComponent } from '@/components/Loading/loading';

interface ThirdClientFormProps {
  control: Control<ClientFormValues>,
  register: UseFormRegister<ClientFormValues>,
}

export function ThirdClientForm({ control, register }: ThirdClientFormProps) {
  const { errors, getValues, reset, goToNextStep, goToPreviousStep } = useRegisterClientContext();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [familiarBonds, setFamiliarBonds] = useState<Option[]>([]);

  const returnToDashboard = () => {
    reset();
    router.push('/RegisterClient/Options')
  }

  useEffect(() => {
    const getLists = async () => {
      try {

        const resFamiliarBonds = await fetch('/api/get_familiar_bonds');
        const familiarBonds = await resFamiliarBonds.json();
        setFamiliarBonds(familiarBonds);

        setIsLoading(false);
      } catch (error) {
        console.log(error)
      }
    }

    getLists();
  }, [])

  return (
    <>
      {isLoading ? <LoadingComponent /> : (
        <>
          <Input
            title="Número de telefone"
            name="contact.phone"
            type="text"
            hint="(91) 988165507"
            errors={errors}
            register={register}
          />
          <Input
            title="Identificação do dono do contato"
            name="contact.owner_identification"
            type="text"
            hint="Leonardo"
            errors={errors}
            register={register}
          />
          <MyCustomDropdown
            title="Vínculo do dono do contato com o atendido"
            fieldName="contact.attended_relationship"
            options={familiarBonds}
            getValues={getValues}
            errors={errors}
            control={control}
          />
          <div className={styles.buttonsBox}>
            <Button
              type="submit"
              name="Enviar"
              onClick={goToNextStep}
            />
            <Button
              type="button"
              name="Voltar"
              onClick={goToPreviousStep}
            />
          </div>
        </>
      )}
    </>)
}