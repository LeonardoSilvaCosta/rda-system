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
  CurrentScreen,
  Option,
  PopulateFormData,
  UpdateClientGeneralDataFormValues
} from '@/types/types';
import { calculateAge } from '@/utils/calculateAge';
import { formatCPFToShow } from '@/utils/formatCpf';
import { formatDate } from '@/utils/formatDateTime';
import { yupResolver } from '@hookform/resolvers/yup';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import * as yup from 'yup';

interface UpdateAttendedProfileGeneralDataFormProps {
  title: string;
  attended: Attended;
  setCurrentScreen: Dispatch<SetStateAction<CurrentScreen>>;
}

export function UpdateAttendedProfileGeneralDataForm({
  title,
  attended,
  setCurrentScreen
}: UpdateAttendedProfileGeneralDataFormProps) {
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
    resolver: yupResolver(validation)
  });

  const isMilitary = attended.rg;

  const supabase = createClientComponentClient();
  const router = useRouter();

  const [ranks, setRanks] = useState<Option[]>([]);
  const [cadres, setCadres] = useState<Option[]>([]);
  const [maritalStatus, setMaritalStatus] = useState<Option[]>([]);
  const [opms, setOpms] = useState<Option[]>([]);
  const [workStatus, setWorkStatus] = useState<Option[]>([]);

  const selectedRank = ranks.find((e) => e.name === attended.rank);
  const selectedCadre = cadres.find((e) => e.name === attended.cadre);
  const selectedMaritalStatus = maritalStatus.find(
    (e) => e.name === attended.maritalStatus
  );
  const selectedOpm = opms.find((e) => e.name === attended.opm);
  const selectedWorkStats = workStatus.find(
    (e) => e.name === attended.workStatus
  );

  const civilVolunteerOptions = [
    { id: 'Sim', name: 'Sim' },
    { id: 'Não', name: 'Não' }
  ];

  const isCivilVolunteer = attended.isCivilVolunteer ? 'Sim' : 'Não';

  const selectedCivilVolunteerOption = civilVolunteerOptions.find(
    (e) => e.id === isCivilVolunteer
  );

  const formDataRequest = async () => {
    const req = await fetch('/api/get_attended_form_data');
    const res = await req.json();

    return res;
  };

  useEffect(() => {
    const getLists = async () => {
      try {
        const response = await formDataRequest();

        setMaritalStatus(
          response
            .filter((e: PopulateFormData) => e.source === 'Marital status')
            .map((maritalStatus: Option) => {
              return {
                id: maritalStatus.id,
                name: maritalStatus.name
              };
            })
        );

        setRanks(
          response
            .filter((e: PopulateFormData) => e.source === 'Rank')
            .map((rank: Option) => {
              return {
                id: rank.id,
                name: rank.name
              };
            })
        );

        setCadres(
          response
            .filter((e: PopulateFormData) => e.source === 'Cadre')
            .map((cadre: Option) => {
              return {
                id: cadre.id,
                name: cadre.name
              };
            })
        );
        setOpms(
          response
            .filter((e: PopulateFormData) => e.source === 'OPM')
            .map((opm: Option) => {
              return {
                id: opm.id,
                name: opm.name
              };
            })
        );
        setWorkStatus(
          response
            .filter((e: PopulateFormData) => e.source === 'Work status')
            .map((workStatus: Option) => {
              return {
                id: workStatus.id,
                name: workStatus.name
              };
            })
        );
      } catch (error) {
        console.log(error);
      }
    };

    getLists();
  }, []);

  const onSubmit: SubmitHandler<UpdateClientGeneralDataFormValues> = async (
    data
  ) => {
    console.log(data);
    // const { data: logedUserData } = await supabase.auth.getUser();
    const isCivilVolunteerToSend =
      data.isCivilVolunteer === 'Sim' ? true : false;

    try {
      const { error } = await supabase
        .from('tb_attendeds')
        .update({
          rank_id: data.rank,
          cadre_id: data.cadre,
          marital_status_id: data.maritalStatus,
          nickname: data.nickName,
          work_status_id: data.workStatus,
          opm_id: data.opm,
          is_civil_volunteer: isCivilVolunteerToSend
        })
        .eq('id', attended.id);

      if (!error) {
        toast.success('Você atualizou os dados do atendido com sucesso.');
        router.refresh();
      } else {
        toast.error(
          `Erro ao atualizar os dados do atendido! Tente novamente mais tarde.`
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
          <button onClick={() => setCurrentScreen('profile')}>Voltar</button>
        </div>
      </header>
      <div className={`${styles.columns} ${title ? styles.link : ''}`}>
        <div className={styles.firstColumn}>
          <UpdateInput
            title="Data de nascimento:"
            name="birthdate"
            type="text"
            errors={errors}
            register={register}
            disabled={true}
            selectedValue={formatDate(attended.birthDate)}
          />
          <UpdateInput
            title="Idade:"
            name="age"
            type="text"
            errors={errors}
            register={register}
            disabled={true}
            selectedValue={calculateAge(new Date(attended.birthDate))}
          />
          <UpdateInput
            title="CPF:"
            name="cpf"
            type="text"
            errors={errors}
            register={register}
            disabled={true}
            selectedValue={formatCPFToShow(attended.cpf)}
          />
          <UpdateCustomDropdown
            title="Estado civil:"
            fieldName="maritalStatus"
            options={maritalStatus}
            errors={errors}
            control={control}
            routeToSearch={'/api/get_marital_status'}
            selectedValue={selectedMaritalStatus}
          />
          <UpdateInput
            title="Sexo:"
            name="gender"
            type="text"
            errors={errors}
            register={register}
            disabled={true}
            selectedValue={attended.gender}
          />
          <UpdateInput
            title="RG:"
            name="rg"
            type="text"
            errors={errors}
            register={register}
            disabled={true}
            selectedValue={attended.rg}
          />
        </div>
        <div className={styles.secondColumn}>
          <UpdateInput
            title="Nome de guerra:"
            name="nickName"
            type="text"
            errors={errors}
            register={register}
            selectedValue={String(attended.nickname)}
          />
          <UpdateCustomDropdown
            title="Posto/graduação:"
            fieldName="rank"
            options={ranks}
            errors={errors}
            control={control}
            routeToSearch={'/api/get_ranks'}
            selectedValue={selectedRank}
          />
          <UpdateCustomDropdown
            title="Quadro:"
            fieldName="cadre"
            options={cadres}
            errors={errors}
            control={control}
            routeToSearch={'/api/get_cadres'}
            selectedValue={selectedCadre}
          />
          <UpdateCustomDropdown
            title="Condição funcional:"
            fieldName="workStatus"
            options={workStatus}
            errors={errors}
            control={control}
            routeToSearch={'/api/get_works_status'}
            selectedValue={selectedWorkStats}
          />
          <UpdateCustomDropdown
            title="OPM:"
            fieldName="opm"
            options={opms}
            errors={errors}
            control={control}
            routeToSearch={'/api/get_opms'}
            selectedValue={selectedOpm}
          />
          {!isMilitary && (
            <RadioGroup
              className={'updateType'}
              title="É voluntário civil"
              name="isCivilVolunteer"
              options={civilVolunteerOptions}
              errors={errors}
              register={register}
              selectedOption={selectedCivilVolunteerOption?.name}
            />
          )}
        </div>
      </div>
    </form>
  );
}
