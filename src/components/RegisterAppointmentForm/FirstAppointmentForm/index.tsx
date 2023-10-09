
import { AppointmentFormValues, Military, Option } from '@/types/types';
import styles from './styles.module.scss';
import { Control, UseFormRegister, UseFormWatch } from "react-hook-form";
import { Input } from '@/components/Input';
import { MyDatePicker } from '@/components/MyDatePicker';
import { RadioGroup } from '@/components/RadioGroup';
import { MyCustomDropdown } from '@/components/MyCustomDropdown';
import { Button } from '@/components/Button';
import { useEffect, useState } from 'react';
import { LoadingComponent } from '@/components/Loading/loading';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRegisterAppointmentContext } from '@/context/registerAppointmentContext';

interface FirstAppointmentFormProps {
  control: Control<AppointmentFormValues>,
  register: UseFormRegister<AppointmentFormValues>,
  watch: UseFormWatch<AppointmentFormValues>,
}

export function FirstAppointmentForm({ control, register }: FirstAppointmentFormProps) {
  const supabase = createClientComponentClient();
  const { errors, getValues, goToPreviousStep, watch } = useRegisterAppointmentContext();
  const [isLoading, setIsLoading] = useState(true);
  const [specialists, setSpecialists] = useState<Option[]>([]);
  const [attendeds, setAttendeds] = useState<Option[]>([]);
  const [accesses, setAccesses] = useState<Option[]>([]);
  const [facilities, setFacilities] = useState<Option[]>([]);
  const [modalities, setModalities] = useState<Option[]>([]);
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
            title="Data"
            name="date"
            errors={errors}
            control={control}
          />
          <Input
            title="Horário"
            name="time"
            type="time"
            hint="10:00"
            errors={errors}
            register={register}
          />
          <MyCustomDropdown
            title="Oficial"
            fieldName="specialist"
            options={specialists}
            getValues={getValues}
            errors={errors}
            control={control}
          />
          <MyCustomDropdown
            title="Atendido"
            fieldName="attended"
            options={attendeds}
            getValues={getValues}
            errors={errors}
            control={control}
          />
          <MyCustomDropdown
            title="Acesso ao atendimento"
            fieldName="access"
            options={accesses}
            getValues={getValues}
            errors={errors}
            control={control}
          />
          <MyCustomDropdown
            title="Local do atendimento"
            fieldName="facility"
            options={facilities}
            getValues={getValues}
            errors={errors}
            control={control}
          />
          <RadioGroup
            title="Moalidade de atendimento"
            name="modality"
            options={modalities}
            errors={errors}
            register={register}
          />
          <RadioGroup
            title="Tem protocolo PAE?"
            name="hasProtocol"
            options={[{ id: "1", name: "Sim" }, { id: "2", name: "Não" }]}
            errors={errors}
            register={register}
          />
          {
            String(watchHasProtocol) === "1" ? (
              <Input
                title="Protocolo"
                name="protocol"
                type="text"
                hint="123/2023"
                errors={errors}
                register={register}
              />
            ) : <></>
          }
          <div className={styles.buttonsBox}>
            <Button
              type={"submit"}
              name="Próxima"
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