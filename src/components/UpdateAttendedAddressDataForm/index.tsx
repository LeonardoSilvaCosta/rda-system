import { useRouter } from 'next/navigation';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { UpdateCustomDropdown } from '../UpdateCustomDropdown';
import { UpdateInput } from '../UpdateInput';
import styles from './styles.module.scss';

import { Address, Attended, Option } from '@/types/types';
import { addressFormValidation } from '@/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface UpdateAttendedAddressDataFormProps {
  title: string;
  attended: Attended;
  setUpdateScreen: Dispatch<SetStateAction<boolean>>;
}

export function UpdateAttendedAddressDataForm({
  title,
  attended,
  setUpdateScreen
}: UpdateAttendedAddressDataFormProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<Address | any>({
    resolver: yupResolver(addressFormValidation)
  });

  const supabase = createClientComponentClient();
  const router = useRouter();

  const [states, setStates] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);

  useEffect(() => {
    const getLists = async () => {
      try {
        const resStates = await fetch('/api/get_ufs');
        const states = await resStates.json();
        setStates(states);
      } catch (error) {
        console.log(error);
      }
    };

    getLists();
  }, []);

  const onSubmit: SubmitHandler<Address> = async (data) => {
    console.log(data);

    try {
      const { error } = await supabase
        .from('tb_addresses')
        .update({
          zip_code: data.zipCode,
          street: data.street,
          neighborhood: data.neighborhood,
          number: data.number,
          complement: data.complement,
          state_acronym: data.stateAcronym,
          city: data.city
        })
        .eq('attended_id', attended.id);

      if (!error) {
        toast.success('Você atualizou o endereço do atendido com sucesso.');
        router.refresh();
      } else {
        toast.error(
          `Erro ao atualizar o endereço do atendido! Tente novamente mais tarde.`
        );
        console.log(
          `Erro ao atualizar o endereço do atendido. ${error.message}.`
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
        <div className={styles.firstColumn}>
          <UpdateInput
            title="CEP:"
            name="cep"
            type="text"
            errors={errors}
            register={register}
            selectedValue={attended.address.zipCode}
          />
          <UpdateInput
            title="Logradouro:"
            name="street"
            type="text"
            errors={errors}
            register={register}
            selectedValue={attended.address.street}
          />
          <UpdateInput
            title="Número:"
            name="number"
            type="text"
            errors={errors}
            register={register}
            selectedValue={attended.address.number}
          />
          <UpdateInput
            title="Complemento:"
            name="complement"
            type="text"
            errors={errors}
            register={register}
            selectedValue={attended.address.complement}
          />
        </div>
        <div className={styles.secondColumn}>
          <UpdateInput
            title="Bairro:"
            name="neighborhood"
            type="text"
            errors={errors}
            register={register}
            selectedValue={attended.address.neighborhood}
          />
          <UpdateCustomDropdown
            title="Estado:"
            fieldName="stateAcronym"
            options={states}
            errors={errors}
            control={control}
            routeToSearch={'/api/get_ufs'}
            selectedValue={[]}
          />
          <UpdateCustomDropdown
            title="Cidade:"
            fieldName="city"
            options={cities}
            errors={errors}
            control={control}
            routeToSearch={`/api/get_cities_from_uf?ufId='falta-colocar'&`}
            selectedValue={[]}
          />
        </div>
      </div>
    </form>
  );
}
