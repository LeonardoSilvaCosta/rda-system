import { useEffect, useState } from 'react';

import styles from './styles.module.scss';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { LoadingComponent } from '@/components/Loading/loading';
import { MyCustomDropdown } from '@/components/MyCustomDropdown';
import { MyCustomMultiSelectDropdown } from '@/components/MyCustomMultiselectDropdown';
import { MyDatePicker } from '@/components/MyDatePicker';
import { MyTimePicker } from '@/components/MyTimePicker';
import { RadioGroup } from '@/components/RadioGroup';
import { useRegisterAppointmentContext } from '@/context/registerAppointmentContext';
import { GenericPerson, Option } from '@/types/types';

export function FirstAppointmentForm() {
  const {
    formDataRequest,
    control,
    errors,
    getValues,
    goToPreviousStep,
    register,
    watch
  } = useRegisterAppointmentContext();
  const [isLoading, setIsLoading] = useState(true);
  const [specialists, setSpecialists] = useState<Option[]>([]);
  const [attendeds, setAttendeds] = useState<Option[]>([]);
  const [accesses, setAccesses] = useState<Option[]>([]);
  const [facilities, setFacilities] = useState<Option[]>([]);
  const [modalities, setModalities] = useState<Option[]>([]);
  const [programs, setPrograms] = useState<Option[]>([]);
  const hasProtocolOptions = [
    { id: 'Sim', name: 'Sim' },
    { id: 'Não', name: 'Não' }
  ];
  const watchHasProtocol = watch('hasProtocol');

  useEffect(() => {
    const getLists = async () => {
      try {
        const response = await formDataRequest();
        const resEspecialists = await fetch('/api/get_specialists');
        const resAttendeds = await fetch('/api/get_attendeds');

        const specialists = await resEspecialists.json();
        const attendeds = await resAttendeds.json();

        const formattedEspecialists = await specialists.map(
          (e: GenericPerson) => {
            return {
              id: e.id,
              name: `${e.rank} ${e.cadre} RG ${e.rg} ${e.nickname}`
            };
          }
        );

        const formatedAttendeds = await attendeds.map((e: GenericPerson) => {
          return {
            id: e.id,
            name:
              e.rank && e.cadre && e.rg && e.nickname
                ? `${e.rank} ${e.cadre} RG ${e.rg} ${e.nickname}`
                : `${e.fullname} - ${e.cpf}`
          };
        });

        setSpecialists(formattedEspecialists);
        setAttendeds(formatedAttendeds);
        setAccesses(
          response
            .filter((e) => e.source === 'Access')
            .map((access) => {
              return {
                id: access.id,
                name: access.name
              };
            })
        );
        setFacilities(
          response
            .filter((e) => e.source === 'Facility')
            .map((facility) => {
              return {
                id: facility.id,
                name: facility.name
              };
            })
        );
        setModalities(
          response
            .filter((e) => e.source === 'Modality')
            .map((modality) => {
              return {
                id: modality.id,
                name: modality.name
              };
            })
        );

        setPrograms(
          response
            .filter((e) => e.source === 'Program')
            .map((program) => {
              return {
                id: program.id,
                name: program.name
              };
            })
        );

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    getLists();
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <>
          <MyDatePicker
            title="Data*"
            name="date"
            errors={errors}
            control={control}
          />
          <MyTimePicker
            title="Horário*"
            name="time"
            errors={errors}
            control={control}
          />
          <MyCustomMultiSelectDropdown
            title="Oficiais*"
            fieldName="specialists"
            getValues={getValues}
            options={specialists}
            errors={errors}
            control={control}
            routeToSearch={'/api/get_specialists'}
          />
          <MyCustomMultiSelectDropdown
            title="Atendidos*"
            fieldName="attendeds"
            getValues={getValues}
            options={attendeds}
            errors={errors}
            control={control}
            routeToSearch={'/api/get_attendeds'}
          />
          <MyCustomDropdown
            title="Acesso ao atendimento*"
            fieldName="access"
            options={accesses}
            getValues={getValues}
            errors={errors}
            control={control}
            routeToSearch={'/api/get_accesses'}
          />
          <MyCustomDropdown
            title="Local do atendimento*"
            fieldName="facility"
            options={facilities}
            getValues={getValues}
            errors={errors}
            control={control}
            routeToSearch={'api/get_opms'}
          />
          <RadioGroup
            title="Modalidade de atendimento*"
            name="modality"
            options={modalities}
            errors={errors}
            register={register}
          />
          <MyCustomDropdown
            title="Programa*"
            fieldName="program"
            options={programs}
            getValues={getValues}
            errors={errors}
            control={control}
            routeToSearch={'api/programs'}
          />
          <RadioGroup
            title="Tem protocolo PAE*?"
            name="hasProtocol"
            options={hasProtocolOptions}
            errors={errors}
            register={register}
          />
          {String(watchHasProtocol) === 'Sim' ? (
            <Input
              title="Protocolo*"
              name="protocol"
              type="text"
              hint="2023/123"
              errors={errors}
              register={register}
            />
          ) : (
            <></>
          )}
          <div className={styles.buttonsBox}>
            <Button type="button" name="Voltar" onClick={goToPreviousStep} />
            <Button type={'submit'} name="Próxima" />
          </div>
        </>
      )}
    </>
  );
}
