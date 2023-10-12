
import { AppointmentFormValues, ClientFormValues, Option } from '@/types/types';
import styles from './styles.module.scss';
import { Control, UseFormRegister } from "react-hook-form";
import { MyCustomDropdown } from '@/components/MyCustomDropdown';
import { Button } from '@/components/Button';
import { useEffect, useState } from 'react';
import { LoadingComponent } from '@/components/Loading/loading';
import { RadioGroup } from '@/components/RadioGroup';
import { MyCustomMultiSelectDropdown } from '@/components/MyCustomMultiselectDropdown';
import { useRegisterAppointmentContext } from '@/context/registerAppointmentContext';
import { MyCustomMultiSelectAndRadioDropdown } from '@/components/MyCustomMultiselectAndRadioDropdown';

export function SecondAppointmentForm() {
  const { control, errors, getValues, register, setValue, goToPreviousStep, watch } = useRegisterAppointmentContext();
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<Option[]>([]);
  const [psychologicalAssessments, setPsychologicalAssessments] = useState<Option[]>([]);
  const [socialAssessments, setSocialAssessments] = useState<Option[]>([]);
  const [generalDemands, setGeneralDemands] = useState<Option[]>([]);
  const [specificDemands, setSpecificsDemands] = useState<Option[]>([]);
  const [procedures, setProcedures] = useState<Option[]>([]);
  const [referralDestinations, setReferralDestinations] = useState<Option[]>([]);
  const [referralTypes, setReferralTypes] = useState<Option[]>([]);
  const [documents, setDocuments] = useState<Option[]>([]);
  const [travels, setTravels] = useState<Option[]>([]);
  const leaveOfAbsenceOptions = [{ id: 'Sim', name: 'Sim'}, { id: 'Não', name: 'Não'}]

  const psychologicalId = "8f911cb1-9a72-4765-bf84-1c273eab0139";
  const socialId = "736eb33d-b012-46e2-9443-29858b965337";
  const watchTypeOfService = watch("typeOfService");

  useEffect(() => {
    const getLists = async () => {
      try {
        const resServices = await fetch('/api/get_services');
        const resPsychologicalAssessments = await fetch('/api/get_psychological_assessments');
        const resSocialAssessments = await fetch('/api/get_social_assessments');
        const resGeneralDemands = await fetch('/api/get_general_demands');
        const resSpecificDemands = await fetch('/api/get_specific_demands');
        const resProcedures = await fetch('/api/get_procedures');
        const resReferralDestinations = await fetch('/api/get_referral_destinations');
        const resReferralTypes = await fetch('/api/get_referral_types');
        const resDocuments = await fetch('/api/get_documents');
        const resTravels = await fetch('/api/get_travels');

        const services = await resServices.json();
        const psychologicalAssessments = await resPsychologicalAssessments.json();
        const socialAssessments = await resSocialAssessments.json();
        const generalDemands = await resGeneralDemands.json();
        const specificDemands = await resSpecificDemands.json();
        const procedures = await resProcedures.json();
        const referralDestinations = await resReferralDestinations.json();
        const referralTypes = await resReferralTypes.json();
        const documents = await resDocuments.json();
        const travels = await resTravels.json();

        setServices(services);
        setPsychologicalAssessments(psychologicalAssessments);
        setSocialAssessments(socialAssessments);
        setGeneralDemands(generalDemands);
        setSpecificsDemands(specificDemands);
        setProcedures(procedures);
        setReferralDestinations(referralDestinations);
        setReferralTypes(referralTypes);
        setDocuments(documents);
        setTravels(travels);

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
          <MyCustomDropdown
            title="Tipo de serviço"
            fieldName="typeOfService"
            options={services}
            errors={errors}
            control={control}
            getValues={getValues}
          />
          {
            String(watchTypeOfService) === psychologicalId ? (
              <MyCustomDropdown
                title="Tipo de avaliação psicológica"
                fieldName="typeOfPsychologicalAssessment"
                options={psychologicalAssessments}
                errors={errors}
                control={control}
                getValues={getValues}
              />
            ) : <></>
          }
          {
            String(watchTypeOfService) === socialId ? (
              <MyCustomDropdown
                title="Tipo de avaliação social"
                fieldName="typeOfSocialAssessment"
                options={socialAssessments}
                errors={errors}
                control={control}
                getValues={getValues}
              />
            ) : <></>
          }
          <MyCustomDropdown
            title="Demanda geral"
            fieldName="generalDemand"
            options={generalDemands}
            errors={errors}
            control={control}
            getValues={getValues}
          />
          <MyCustomMultiSelectDropdown
            title="Demanda específica"
            fieldName="specificDemands"
            getValues={getValues}
            options={specificDemands}
            errors={errors}
            control={control}
          />
          <MyCustomDropdown
            title="Procedimento"
            fieldName="procedure"
            options={procedures}
            errors={errors}
            control={control}
            getValues={getValues}
          />
          <MyCustomMultiSelectDropdown
            title="Documentos produzidos"
            fieldName="documents"
            getValues={getValues}
            options={documents}
            errors={errors}
            control={control}
          />
          <MyCustomMultiSelectDropdown
            title="Deslocamentos"
            fieldName="travels"
            getValues={getValues}
            options={travels}
            errors={errors}
            control={control}
          />
          <MyCustomMultiSelectAndRadioDropdown
            title="Encaminhamentos"
            firstFieldName="referrals.destinations"
            secondFieldName="referrals.types"
            getValues={getValues}
            setValue={setValue}
            firstOptions={referralDestinations}
            secondOptions={referralTypes}
            errors={errors}
            control={control}
          />
          <RadioGroup
            title="Houve afastamento?"
            options={leaveOfAbsenceOptions}
            name="hasLeaveOfAbsence"
            errors={errors}
            register={register}
          />
          <div className={styles.buttonsBox}>
            <Button
              type="submit"
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