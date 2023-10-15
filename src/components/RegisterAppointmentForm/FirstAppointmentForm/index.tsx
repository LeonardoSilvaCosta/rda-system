
import { Military, Option } from '@/types/types';
import styles from './styles.module.scss';
import { Input } from '@/components/Input';
import { MyDatePicker } from '@/components/MyDatePicker';
import { RadioGroup } from '@/components/RadioGroup';
import { MyCustomDropdown } from '@/components/MyCustomDropdown';
import { Button } from '@/components/Button';
import { useEffect, useState } from 'react';
import { LoadingComponent } from '@/components/Loading/loading';
import { useRegisterAppointmentContext } from '@/context/registerAppointmentContext';
import { MyCustomMultiSelectDropdown } from '@/components/MyCustomMultiselectDropdown';

export function FirstAppointmentForm() {
  const { control, errors, getValues, goToPreviousStep, register, watch } = useRegisterAppointmentContext();
  const [isLoading, setIsLoading] = useState(true);
  const [specialists, setSpecialists] = useState<Option[]>([]);
  const [attendeds, setAttendeds] = useState<Option[]>([]);
  const [accesses, setAccesses] = useState<Option[]>([]);
  const [facilities, setFacilities] = useState<Option[]>([]);
  const [modalities, setModalities] = useState<Option[]>([]);
  const hasProtocolOptions = [{ id: 'Sim', name: 'Sim' }, { id: 'Não', name: 'Não'}]
  const watchHasProtocol = watch("hasProtocol");

  useEffect(() => {
    const getLists = async () => {
      try {
        const resEspecialists = await fetch('/api/get_specialists');
        const resAttendeds = await fetch('/api/get_attendeds');
        const resAccesses = await fetch('/api/get_accesses');
        const resFacilities = await fetch('/api/get_opms');
        const resModalities = await fetch('/api/get_modalities');

        const specialists = await resEspecialists.json();
        const attendeds = await resAttendeds.json();
        const accesses = await resAccesses.json();
        const facilities = await resFacilities.json();
        const modalities = await resModalities.json();

        const formattedEspecialists = await specialists.map((e: Military) => {
          return {
            id: e.id,
            name: `${e.rank} ${e.cadre} RG ${e.rg} ${e.nickname}`,
          }
        })

        const formatedAttendeds = await attendeds.map((e: Military) => {
          return {
            id: e.id,
            name: (e.rank && e.cadre && e.rg && e.nickname) ? `${e.rank} ${e.cadre} RG ${e.rg} ${e.nickname}` : `${e.fullname} - ${e.cpf}`,
          }
        })

        setSpecialists(formattedEspecialists);
        setAttendeds(formatedAttendeds);
        setAccesses(accesses);
        setFacilities(facilities);
        setModalities(modalities);

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
          <MyDatePicker
            title="Data*"
            name="date"
            errors={errors}
            control={control}
          />
          <Input
            title="Horário*"
            name="time"
            type="time"
            hint="10:00"
            errors={errors}
            register={register}
          />
          <MyCustomMultiSelectDropdown
            title="Oficiais*"
            fieldName="specialists"
            getValues={getValues}
            options={specialists}
            errors={errors}
            control={control}
          />
           <MyCustomMultiSelectDropdown
            title="Atendidos*"
            fieldName="attendeds"
            getValues={getValues}
            options={attendeds}
            errors={errors}
            control={control}
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
          <RadioGroup
            title="Tem protocolo PAE*?"
            name="hasProtocol"
            options={hasProtocolOptions}
            errors={errors}
            register={register}
          />
          {
            String(watchHasProtocol) === "Sim" ? (
              <Input
                title="Protocolo*"
                name="protocol"
                type="text"
                hint="2023/123"
                errors={errors}
                register={register}
              />
            ) : <></>
          }
          <div className={styles.buttonsBox}>
            <Button
              type="button"
              name="Voltar"
              onClick={goToPreviousStep}
            />
            <Button
              type={"submit"}
              name="Próxima"
            />
          </div>
        </>
      )}
    </>)
}