import { useEffect, useState } from 'react';
import {
  Control,
  FieldPath,
  Path,
  UseFormRegister,
  useFieldArray
} from 'react-hook-form';

import styles from './styles.module.scss';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { LoadingComponent } from '@/components/Loading/loading';
import { MaskedInput } from '@/components/MaskedInput';
import { MyCustomDropdown } from '@/components/MyCustomDropdown';
import { useRegisterClientContext } from '@/context/registerClientContext';
import { ClientFormValues } from '@/types/types';

interface ThirdClientFormProps {
  control: Control<ClientFormValues>;
  register: UseFormRegister<ClientFormValues>;
}

const contactDefaultValues = {
  phone: '',
  ownerIdentification: '',
  bond: '',
  attended_id: ''
};

export function ThirdClientForm({ control, register }: ThirdClientFormProps) {
  const { clearErrors, errors, getValues, goToPreviousStep, clientFormData } =
    useRegisterClientContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts'
  });
  const [isLoading, setIsLoading] = useState(true);
  const familiarBonds = clientFormData
    .filter((e) => e.source === 'Familiar bond')
    .map((familiarBond) => {
      return {
        id: familiarBond.id,
        name: familiarBond.name
      };
    });

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const contactBoxElements = () => {
    return (
      <>
        {fields.map((field, index) => {
          const phone = `contacts.${index}.phone` as Path<ClientFormValues>;
          const ownerIdentification =
            `contacts.${index}.ownerIdentification` as Path<ClientFormValues>;
          const bond = `contacts.${index}.bond` as FieldPath<ClientFormValues>;

          const isSecondOrLater = index >= 1;

          return (
            <div
              key={field.id}
              className={`${styles.contactBox} ${
                isSecondOrLater ? styles.withMarginTop : ''
              }`}
            >
              <div className={styles.boxHeader}>
                <span>{`Contato ${index + 1}`}</span>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    name="Remover"
                    onClick={() => remove(index)}
                  />
                )}
              </div>
              <div>
                <MaskedInput
                  title="Número de telefone*"
                  name={phone}
                  type="text"
                  hint="(91) 988165507"
                  errors={errors}
                  register={register}
                  mask={'(99) 99999-9999'}
                />
                <span className="error-message">
                  {errors.contacts && errors.contacts[index]?.phone?.message}
                </span>
                <Input
                  title="Identificação do dono do contato*"
                  name={ownerIdentification}
                  type="text"
                  hint="Próprio"
                  errors={errors}
                  register={register}
                />
                <span className="error-message">
                  {errors.contacts &&
                    errors.contacts[index]?.ownerIdentification?.message}
                </span>
                <MyCustomDropdown
                  title="Vínculo do dono do contato com o atendido"
                  fieldName={bond}
                  options={familiarBonds}
                  getValues={getValues}
                  errors={errors}
                  control={control}
                  routeToSearch={'/api/get_familiar_bonds'}
                />
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <>
          <h2>Contatos</h2>
          <div className={styles.container}>
            {contactBoxElements()}
            <div className={styles.moreButtonBox}>
              <Button
                type="button"
                name="Novo contato"
                onClick={() => {
                  clearErrors();
                  append(contactDefaultValues);
                }}
              />
            </div>
          </div>
          <div className={styles.buttonsBox}>
            <Button type="button" name="Voltar" onClick={goToPreviousStep} />
            <Button type="submit" name="Enviar" />
          </div>
        </>
      )}
    </>
  );
}
