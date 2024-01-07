import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

import styles from './styles.module.scss';

import { Button } from '@/components/Button';
import { LoadingComponent } from '@/components/Loading/loading';
import { MyCustomDoubleMultiSelectDropdown } from '@/components/MyCustomDoubleMultiselectDropdown';
import { MyCustomDropdown } from '@/components/MyCustomDropdown';
import { MyCustomMultiSelectDropdown } from '@/components/MyCustomMultiselectDropdown';
import { RadioGroup } from '@/components/RadioGroup';
import { TextArea } from '@/components/TextArea';
import { useRegisterAppointmentContext } from '@/context/registerAppointmentContext';

export function SecondAppointmentForm() {
  const {
    appointmentFormData,
    control,
    errors,
    getValues,
    register,
    setError,
    setValue,
    goToPreviousStep,
    watch
  } = useRegisterAppointmentContext();
  const [isLoading, setIsLoading] = useState(true);
  const services = appointmentFormData
    .filter((e) => e.source === 'Service')
    .map((service) => {
      return {
        id: service.id,
        name: service.name
      };
    });
  const psychologicalAssessments = appointmentFormData
    .filter((e) => e.source === 'Psychological assessment')
    .map((psychologicalAssessment) => {
      return {
        id: psychologicalAssessment.id,
        name: psychologicalAssessment.name
      };
    });
  const socialAssessments = appointmentFormData
    .filter((e) => e.source === 'Social assessment')
    .map((socialAssessment) => {
      return {
        id: socialAssessment.id,
        name: socialAssessment.name
      };
    });
  const generalDemands = appointmentFormData
    .filter((e) => e.source === 'General demand')
    .map((generalDemand) => {
      return {
        id: generalDemand.id,
        name: generalDemand.name
      };
    });
  const specificDemands = appointmentFormData
    .filter((e) => e.source === 'Specific demand')
    .map((specificDemand) => {
      return {
        id: specificDemand.id,
        name: specificDemand.name
      };
    });
  const procedures = appointmentFormData
    .filter((e) => e.source === 'Procedure')
    .map((procedure) => {
      return {
        id: procedure.id,
        name: procedure.name
      };
    });
  const employmentStatus = appointmentFormData
    .filter((e) => e.source === 'Employment status')
    .map((employmentStatus) => {
      return {
        id: employmentStatus.id,
        name: employmentStatus.name
      };
    });
  const referralDestinations = appointmentFormData
    .filter((e) => e.source === 'Referral destination')
    .map((referralDestination) => {
      return {
        id: referralDestination.id,
        name: referralDestination.name
      };
    });
  const referralTypes = appointmentFormData
    .filter((e) => e.source === 'Referral type')
    .map((referralType) => {
      return {
        id: referralType.id,
        name: referralType.name
      };
    });
  const documents = appointmentFormData
    .filter((e) => e.source === 'Document')
    .map((document) => {
      return {
        id: document.id,
        name: document.name
      };
    });
  const travels = appointmentFormData
    .filter((e) => e.source === 'Travel')
    .map((travel) => {
      return {
        id: travel.id,
        name: travel.name
      };
    });

  const hasLeaveOfAbsenceOptions = [
    { id: 'S', name: 'Sim' },
    { id: 'N', name: 'Não' }
  ];

  const hospitalization = [
    { id: '1', name: 'Sim' },
    { id: '2', name: 'Não' }
  ];

  const psychologicalId = '8f911cb1-9a72-4765-bf84-1c273eab0139';
  const socialId = '736eb33d-b012-46e2-9443-29858b965337';
  const saeId = '2451d79f-f67e-4b7f-b8b2-2fefdb841c84';
  const watchTypeOfService = watch('service');

  String(watchTypeOfService) !== psychologicalId &&
    setValue('psychologicalAssessment', null);
  String(watchTypeOfService) !== socialId && setValue('socialAssessment', null);

  useEffect(() => {
    const getLists = async () => {
      try {
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
          <MyCustomDropdown
            title="Tipo de serviço*"
            fieldName="service"
            options={services}
            errors={errors}
            control={control}
            getValues={getValues}
            routeToSearch={'/api/get_services'}
          />
          {String(watchTypeOfService) === psychologicalId ? (
            <MyCustomDropdown
              title="Tipo de avaliação psicológica*"
              fieldName="psychologicalAssessment"
              options={psychologicalAssessments}
              errors={errors}
              control={control}
              getValues={getValues}
              routeToSearch={'/api/get_psychological_assessments'}
            />
          ) : (
            <></>
          )}
          {String(watchTypeOfService) === socialId ? (
            <MyCustomDropdown
              title="Tipo de avaliação social*"
              fieldName="socialAssessment"
              options={socialAssessments}
              errors={errors}
              control={control}
              getValues={getValues}
              routeToSearch={'/api/get_social_assessments'}
            />
          ) : (
            <></>
          )}
          {String(watchTypeOfService) === saeId ? (
            <MyCustomDropdown
              title="Condição laboral*"
              fieldName="employmentStatus"
              options={employmentStatus}
              errors={errors}
              control={control}
              getValues={getValues}
              routeToSearch={'/api/get_employment_status'}
            />
          ) : (
            <></>
          )}
          <MyCustomDropdown
            title="Demanda geral*"
            fieldName="generalDemand"
            options={generalDemands}
            errors={errors}
            control={control}
            getValues={getValues}
            routeToSearch={'/api/get_general_demands'}
          />
          <MyCustomMultiSelectDropdown
            title="Demanda específica"
            fieldName="specificDemands"
            getValues={getValues}
            options={specificDemands}
            errors={errors}
            control={control}
            routeToSearch={'/api/get_specific_demands'}
          />
          <MyCustomDropdown
            title="Procedimento*"
            fieldName="procedure"
            options={procedures}
            errors={errors}
            control={control}
            getValues={getValues}
            routeToSearch={'/api/get_procedures'}
          />
          <MyCustomMultiSelectDropdown
            title="Documentos produzidos"
            fieldName="producedDocuments"
            getValues={getValues}
            options={documents}
            errors={errors}
            control={control}
            routeToSearch={'/api/get_produced_documents'}
          />
          <MyCustomMultiSelectDropdown
            title="Deslocamentos"
            fieldName="travels"
            getValues={getValues}
            options={travels}
            errors={errors}
            control={control}
            routeToSearch={'/api/get_travels'}
          />
          <MyCustomDoubleMultiSelectDropdown
            title="Encaminhamentos"
            fieldname="referrals"
            getValues={getValues}
            setValue={setValue}
            firstOptions={referralDestinations}
            secondOptions={referralTypes}
            fieldErrorName={'hasFirstOptionWithoutSecondOption'}
            errors={errors}
            setError={setError}
            control={control}
            routeToSearch={'/api/get_referral_destinations'}
          />
          <RadioGroup
            title="Houve afastamento?*"
            options={hasLeaveOfAbsenceOptions}
            name="hasLeaveOfAbsence"
            errors={errors}
            register={register}
          />
          {String(watchTypeOfService) === saeId ? (
            <RadioGroup
              title="Houve internação?*"
              options={hospitalization}
              name="hospitalization"
              errors={errors}
              register={register}
            />
          ) : (
            <></>
          )}
          <TextArea
            title="Evolução*"
            name="recordProgress"
            hint="O atendido apresentou discurso coerente e organizado..."
            errors={errors}
            register={register}
          />
          <div className={styles.buttonsBox}>
            <Button type="button" name="Voltar" onClick={goToPreviousStep} />
            <Button type="submit" name="Enviar" />
            <Toaster />
          </div>
        </>
      )}
    </>
  );
}
