import { useEffect, useState } from 'react';
import { Control, UseFormRegister } from 'react-hook-form';

import styles from './styles.module.scss';

import { Button } from '@/components/Button';
import { LoadingComponent } from '@/components/Loading/loading';
import { RadioGroup } from '@/components/RadioGroup';
import { useRegisterUserContext } from '@/context/registerUserContext';
import { UserFormValues } from '@/types/types';

interface FirstUserFormProps {
  control: Control<UserFormValues>;
  register: UseFormRegister<UserFormValues>;
}

export function FirstUserForm({ register }: FirstUserFormProps) {
  const { errors, goToPreviousStep, formDataRequest } =
    useRegisterUserContext();
  const [isLoading, setIsLoading] = useState(true);

  const isMilitaryOptions = [
    { id: 'Sim', name: 'Sim' },
    { id: 'Não', name: 'Não' }
  ];

  useEffect(() => {
    const getFormData = async () => {
      try {
        await formDataRequest();

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    getFormData();
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <main className={styles.container}>
          <RadioGroup
            title="O usuário que será cadastrado é militar?"
            name="isMilitary"
            options={isMilitaryOptions}
            errors={errors}
            register={register}
          />
          <div className={styles.buttonsBox}>
            <Button type="button" name="Voltar" onClick={goToPreviousStep} />
            <Button type={'submit'} name="Próxima" />
          </div>
        </main>
      )}
    </>
  );
}
