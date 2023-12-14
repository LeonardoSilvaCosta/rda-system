import { useRouter } from 'next/navigation';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { RadioGroup } from '../RadioGroup';
import { UpdateCustomDropdown } from '../UpdateCustomDropdown';
import { UpdateInput } from '../UpdateInput';
import styles from './styles.module.scss';

import {
  Attended,
  Contact,
  Option,
  UpdateClientGeneralDataFormValues
} from '@/types/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import * as yup from 'yup';

interface UpdateAttendedContactsDataFormProps {
  title: string;
  attended: Attended;
  setUpdateScreen: Dispatch<SetStateAction<boolean>>;
}

export function UpdateAttendedContactsDataForm({
  title,
  attended,
  setUpdateScreen
}: UpdateAttendedContactsDataFormProps) {
  const validation = yup.object({
    nickName: yup.string().required("O campo 'Nome de guerra' é obrigatório.")
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<UpdateClientGeneralDataFormValues | any>({
    // resolver: yupResolver(validation)
  });

  const supabase = createClientComponentClient();
  const router = useRouter();
  const [bonds, setBonds] = useState<Option[]>([]);

  useEffect(() => {
    const getLists = async () => {
      try {
        const resBonds = await fetch('/api/get_familiar_bonds');
        if (!resBonds.ok) {
          throw new Error(
            `Falha ao buscar as opções de vínculo familiar: ${resBonds.statusText}`
          );
        }

        const bonds = await resBonds.json();
        setBonds(bonds);
      } catch (error) {
        console.error('Erro ao buscar as opções de vínculo familiar:', error);
      }
    };

    getLists();
  }, []);

  const onSubmit: SubmitHandler<Contact> = async (data) => {
    console.log(data);
    // const { data: logedUserData } = await supabase.auth.getUser();

    try {
      const { error } = await supabase
        .from('tb_phones')
        .update({
          phone: data.phone,
          owner_identification: data.ownerIdentification,
          bond: data.bond
        })
        .eq('id', attended.id);

      if (!error) {
        toast.success('Você atualizou os contatos do atendido com sucesso.');
        router.refresh();
      } else {
        toast.error(
          `Erro ao atualizar os contatos do atendido! Tente novamente mais tarde.`
        );
        console.log(
          `Erro ao atualizar os dados do atendido. ${error.message}.`
        );
      }
    } catch (error) {
      toast.error(
        `Houve algum problema no cadastro de seu formulário, tente novamente.`
      );
      console.log(`Problema no cadastro de seu formulário.`);
      throw error;
    } finally {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      <header>
        <span>{title}</span>
        <div className={styles.buttonBox}>
          <button type="submit">Salvar</button>
          <button onClick={() => setUpdateScreen(false)}>Voltar</button>
        </div>
      </header>
      <div className={`${styles.columns} ${title ? styles.link : ''}`}>
        {attended.phones.map((phone) => (
          <React.Fragment key={phone.phone}>
            <div className={styles.firstColumn}>
              <UpdateInput
                title="Telefone:"
                name="phone"
                type="text"
                errors={errors}
                register={register}
                selectedValue={phone.phone}
              />
              <UpdateInput
                title="Dono do contato:"
                name="ownerIdentification"
                type="text"
                errors={errors}
                register={register}
                selectedValue={phone.ownerIdentification}
              />
              <UpdateCustomDropdown
                title="Vínculo:"
                fieldName="bond"
                options={bonds}
                errors={errors}
                control={control}
                routeToSearch={'/api/get_familiar_bonds'}
                selectedValue={{
                  id: '',
                  name: ''
                }}
              />
            </div>
          </React.Fragment>
        ))}
      </div>
    </form>
  );
}
