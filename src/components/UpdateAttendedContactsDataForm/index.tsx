import { useRouter } from 'next/navigation';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FieldPath, Path, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { UpdateCustomDropdown } from '../UpdateCustomDropdown';
import { UpdateInput } from '../UpdateInput';
import styles from './styles.module.scss';

import { Attended, Contact, Option } from '@/types/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import * as yup from 'yup';

interface UpdateAttendedContactsDataFormProps {
  title: string;
  attended: Attended;
  setUpdateScreen: Dispatch<SetStateAction<boolean>>;
}

type FormData = {
  contacts: Contact[];
};

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
    reset
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<FormData | any>({
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

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log(data);
    // const { data: logedUserData } = await supabase.auth.getUser();

    const phones = data.contacts.map((e: Contact) => {
      return {
        phone: e.phone,
        owner_identification: e.ownerIdentification,
        bond: e.bond
      };
    });

    try {
      const errors = [];
      for (let i = 0; i < phones.length; i++) {
        const { error } = await supabase
          .from('tb_phones')
          .update(phones[i])
          .match({ attended_id: attended.id, phone: attended.phones[i].phone });

        error && errors.push(error);
      }
      if (errors.length === 0) {
        toast.success('Você atualizou os contatos do atendido com sucesso.');
        router.refresh();
      } else {
        toast.error(
          `Erro ao atualizar os contatos do atendido! Tente novamente mais tarde.`
        );
        errors.forEach((e) => {
          console.log(`Erro ao atualizar os dados do atendido. ${e.message}.`);
        });
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
        <div className={styles.firstColumn}>
          {attended.phones.slice(0, 3).map((item, index) => {
            const phone = `contacts.${index}.phone` as Path<Contact>;
            const ownerIdentification =
              `contacts.${index}.ownerIdentification` as Path<Contact>;
            const bond = `contacts.${index}.bond` as FieldPath<Contact>;

            return (
              <React.Fragment key={item.phone}>
                <UpdateInput
                  title="Telefone:"
                  name={phone}
                  type="text"
                  errors={errors}
                  register={register}
                  selectedValue={item.phone}
                />
                <UpdateInput
                  title="Dono do contato:"
                  name={ownerIdentification}
                  type="text"
                  errors={errors}
                  register={register}
                  selectedValue={item.ownerIdentification}
                />
                <UpdateCustomDropdown
                  title="Vínculo:"
                  fieldName={bond}
                  options={bonds}
                  errors={errors}
                  control={control}
                  routeToSearch={'/api/get_familiar_bonds'}
                  selectedValue={bonds.find((e) => e.name === item.bond)}
                />
              </React.Fragment>
            );
          })}
        </div>
        {attended.phones.length > 3 && (
          <div className={styles.secondColumn}>
            {attended.phones.slice(3).map((item, index) => {
              const phone = `contacts.${index}.phone` as Path<Contact>;
              const ownerIdentification =
                `contacts.${index}.ownerIdentification` as Path<Contact>;
              const bond = `contacts.${index}.bond` as FieldPath<Contact>;

              return (
                <React.Fragment key={item.phone}>
                  <UpdateInput
                    title="Telefone:"
                    name={phone}
                    type="text"
                    errors={errors}
                    register={register}
                    selectedValue={item.phone}
                  />
                  <UpdateInput
                    title="Dono do contato:"
                    name={ownerIdentification}
                    type="text"
                    errors={errors}
                    register={register}
                    selectedValue={item.ownerIdentification}
                  />
                  <UpdateCustomDropdown
                    title="Vínculo:"
                    fieldName={bond}
                    options={bonds}
                    errors={errors}
                    control={control}
                    routeToSearch={'/api/get_familiar_bonds'}
                    selectedValue={{
                      id: item.bond_id,
                      name: item.bond
                    }}
                  />
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </form>
  );
}
