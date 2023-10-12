
import { ClientFormValues, Option } from '@/types/types';
import styles from './styles.module.scss';
import { Control, FieldPath, Path, UseFormRegister, useFieldArray } from "react-hook-form";
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useRegisterClientContext } from '@/context/registerClientContext';
import { useEffect, useState } from 'react';
import { LoadingComponent } from '@/components/Loading/loading';
import { MyCustomDropdown } from '@/components/MyCustomDropdown';
import { MaskedInput } from '@/components/MaskedInput';

interface ThirdClientFormProps {
  control: Control<ClientFormValues>,
  register: UseFormRegister<ClientFormValues>,
}

const contactDefaultValues = {
  phone: '',
  ownerIdentification: '',
  attendedRelationship: '',
  attended_id: ''
}

export function ThirdClientForm({ control, register }: ThirdClientFormProps) {
  const { clearErrors, errors, getValues, goToPreviousStep } = useRegisterClientContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [familiarBonds, setFamiliarBonds] = useState<Option[]>([]);

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

  const contactBoxElements = () => {
    return (
      <>
        {
          fields.map((field, index) => {
            const phone = `contacts.${index}.phone` as Path<ClientFormValues>;
            const ownerIdentification = `contacts.${index}.ownerIdentification` as Path<ClientFormValues>;
            const attendedRelationship = `contacts.${index}.attendedRelationship` as FieldPath<ClientFormValues>;

            const isSecondOrLater = index >= 1;

            return (
              <div key={field.id} className={`${styles.contactBox} ${isSecondOrLater ? styles.withMarginTop : ''}`}>
                <div className={styles.boxHeader}>
                  <span>{`Contato ${index + 1}`}</span>
                  {fields.length > 1 && (
                    <Button
                      type='button'
                      name='Remover'
                      onClick={() => remove(index)}
                    />
                  )
                  }
                </div>
                <div>
                  <MaskedInput
                    title="Número de telefone"
                    name={phone}
                    type="text"
                    hint="(91) 988165507"
                    errors={errors}
                    register={register}
                    mask={"(99) 99999-9999"}
                  />
                  <Input
                    title="Identificação do dono do contato"
                    name={ownerIdentification}
                    type="text"
                    hint="Leonardo"
                    errors={errors}
                    register={register}
                  />
                  <MyCustomDropdown
                    title="Vínculo do dono do contato com o atendido"
                    fieldName={attendedRelationship}
                    options={familiarBonds}
                    getValues={getValues}
                    errors={errors}
                    control={control}
                    tableToSearch={'tb_familiar_bonds'}
                    columnToSearch={'name'}
                  />
                </div>
              </div >
            )
          })
        }
      </>
    )
  }

  return (
    <>
      {isLoading ? <LoadingComponent /> : (
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
            <Button
              type="submit"
              name="Enviar"
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