
import { Address, City, ClientFormValues, Military, Option } from '@/types/types';
import styles from './styles.module.scss';
import { Control, UseFormRegister, UseFormWatch } from "react-hook-form";
import { Input } from '@/components/Input';
import { MyDatePicker } from '@/components/MyDatePicker';
import { RadioGroup } from '@/components/RadioGroup';
import { MyCustomDropdown } from '@/components/MyCustomDropdown';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';
import { useRegisterClientContext } from '@/context/registerClientContext';
import { useEffect, useState } from 'react';
import { LoadingComponent } from '@/components/Loading/loading';
import { Options } from 'next/dist/server/base-server';

interface FormComponentProps {
  type: string | null;
  control: Control<ClientFormValues>,
  register: UseFormRegister<ClientFormValues>,
  watch: UseFormWatch<ClientFormValues>,
}

export function FormComponent({ type, control, register }: FormComponentProps) {
  const { errors, getValues, reset, setValue } = useRegisterClientContext();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [ranks, setRanks] = useState<Option[]>([]);
  const [cadres, setCadres] = useState<Option[]>([]);
  const [genders, setGenders] = useState<Option[]>([]);
  const [maritalStatus, setMaritalStatus] = useState<Option[]>([]);
  const [opms, setOpms] = useState<Option[]>([]);
  const [states, setStates] = useState<Option[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState<Option[]>([]);
  const [militaryAttendeds, setMilitaryAttendeds] = useState<Option[]>([]);
  const [workStatus, setWorkStatus] = useState<Option[]>([]);
  const [familiarBonds, setFamiliarBonds] = useState<Option[]>([]);
  const civilVolunteerOptions = [{ id: "Sim", name: "Sim" }, { id: "Não", name: "Não" }];

  const isMilitary = type === "militar";
  const isDependent = type === "dependente";
  const isCivilian = type === "civil-sem-vínculo"

  const returnToDashboard = () => {
    reset();
    router.push('/RegisterClient/Options')
  }

  useEffect(() => {
    const getLists = async () => {
      try {
        const resRanks = await fetch('/api/get_ranks');
        const resCadres = await fetch('/api/get_cadres');
        const resGenders = await fetch('/api/get_genders');
        const resMaritalStatus = await fetch('/api/get_marital_status');
        const resOpms = await fetch('/api/get_opms');
        const resStates = await fetch('/api/get_ufs');
        const resMilitaryAttendeds = await fetch('/api/get_military_attendeds');
        const resWorkStatus = await fetch('/api/get_work_status');
        const resFamiliarBonds = await fetch('/api/get_familiar_bonds');

        const ranks = await resRanks.json();
        const cadres = await resCadres.json();
        const genders = await resGenders.json();
        const maritalStatus = await resMaritalStatus.json();
        const opms = await resOpms.json();
        const states = await resStates.json();
        const militaryAttendeds = await resMilitaryAttendeds.json();
        const workStatus = await resWorkStatus.json();
        const familiarBonds = await resFamiliarBonds.json();

        setRanks(ranks);
        setCadres(cadres);
        setGenders(genders);
        setMaritalStatus(maritalStatus);
        setOpms(opms);
        setWorkStatus(workStatus);
        setFamiliarBonds(familiarBonds);
        setStates(states);

        const formatedMilitaryAttendeds = await militaryAttendeds.map((e: Military) => {
          return {
            id: e.id,
            name: `${e.rank} ${e.cadre} RG ${e.rg} ${e.nickname}`
          }
        })

        setMilitaryAttendeds(formatedMilitaryAttendeds);

        setIsLoading(false);
      } catch (error) {
        console.log(error)
      }
    }

    getLists();
  }, [])

  const selectCities = async (ufId: string, cityName?: string) => {
    fetch(`/api/get_cities_from_uf?ufId=${ufId}`)
      .then((response) => response.json())
      .then((data) => {
        setCities(data);
        const city = data.find((e: Option) => e.name === cityName);
        if (city) {
          setValue('address.city', city.id);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar cidades:", error);
      });
  }

  useEffect(() => {
    if (selectedState) {
      selectCities(selectedState);
    } else {
      setCities([]);
    }
  }, [selectedState]);


  const getAddressInfo = async (e: any): Promise<void> => {
    const cep = e.target.value.replace(/\D/g, '')
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const address = await res.json();
    setValue('address.street', address.logradouro);
    setValue('address.neighborhood', address.bairro);
    setValue('address.complement', address.complemento);

    const uf = states.find(e => e.name === address.uf);
    if (uf) {
      setValue('address.stateAcronym', uf.id);
      setSelectedState(uf.id);

      selectCities(uf.id, address.localidade);
    }
    else {
      setSelectedState("");
      setCities([]);
    }
  }

  return (
    <>
      {isLoading ? <LoadingComponent /> : (
        <>
          <Input
            title="Nome completo"
            name="fullName"
            type="text"
            hint="LEONARDO DA SILVA COSTA"
            errors={errors}
            register={register}
          />
          {
            isDependent && (
              <>
                <MyCustomDropdown
                  title="Titular"
                  fieldName="policyHolder"
                  options={militaryAttendeds}
                  getValues={getValues}
                  errors={errors}
                  control={control}
                />
                <MyCustomDropdown
                  title="Vínculo"
                  fieldName="familiarBond"
                  options={familiarBonds}
                  getValues={getValues}
                  errors={errors}
                  control={control}
                />
              </>
            )
          }
          {
            isMilitary && (
              <>
                <Input
                  title="Nome de guerra"
                  name="nickName"
                  type="text"
                  hint="LEONARDO"
                  errors={errors}
                  register={register}
                />
                <Input
                  title="RG"
                  name="rg"
                  type="text"
                  hint="40897"
                  errors={errors}
                  register={register}
                />
                <MyCustomDropdown
                  title="Posto/graduação"
                  fieldName="rank"
                  options={ranks}
                  getValues={getValues}
                  errors={errors}
                  control={control}
                />
                <MyCustomDropdown
                  title="Quadro"
                  fieldName="cadre"
                  options={cadres}
                  getValues={getValues}
                  errors={errors}
                  control={control}
                />
                <MyCustomDropdown
                  title="OPM"
                  fieldName="opm"
                  options={opms}
                  getValues={getValues}
                  errors={errors}
                  control={control}
                />
                <MyCustomDropdown
                  title="Situação funcional"
                  fieldName="workStatus"
                  options={workStatus}
                  getValues={getValues}
                  errors={errors}
                  control={control}
                  selectedState={selectedState}
                  setSelectedState={setSelectedState}
                />
              </>)
          }
          <RadioGroup
            title="Sexo"
            name="gender"
            options={genders}
            errors={errors}
            register={register}
          />
          <Input
            title="CPF"
            name="cpf"
            type="text"
            hint="000.000.000-00"
            errors={errors}
            register={register}
          />
          <MyDatePicker
            title="Data de nascimento"
            name="birthDate"
            errors={errors}
            control={control}
          />
          <MyCustomDropdown
            title="Estado civil"
            fieldName="maritalStatus"
            options={maritalStatus}
            getValues={getValues}
            errors={errors}
            control={control}
          />
          <Input
            title="CEP"
            name="address.zipCode"
            type="text"
            hint="00035-510"
            getAddressInfo={getAddressInfo}
            errors={errors}
            register={register}
          />
          <Input
            title="Logradouro"
            name="address.street"
            type="text"
            hint="Rua Satélite"
            errors={errors}
            register={register}
          />
          <Input
            title="Bairro"
            name="address.neighborhood"
            type="text"
            hint="Parque verde"
            errors={errors}
            register={register}
          />
          <Input
            title="Número"
            name="address.number"
            type="text"
            hint="34-A"
            errors={errors}
            register={register}
          />
          <Input
            title="Complemento"
            name="address.complement"
            type="text"
            hint="Próximo ao supermercado Líder"
            errors={errors}
            register={register}
          />
          <MyCustomDropdown
            title="Estado"
            fieldName="address.stateAcronym"
            options={states}
            getValues={getValues}
            errors={errors}
            control={control}
            setSelectedState={setSelectedState}
          />
          <MyCustomDropdown
            title="Cidade"
            fieldName="address.city"
            options={cities}
            getValues={getValues}
            errors={errors}
            control={control}
          />
          {/* <MyCustomDropdown
            title="Cidade de residência"
            fieldName="cityOfResidence"
            options={cities}
            getValues={getValues}
            errors={errors}
            control={control}
          /> */}
          {
            (isDependent || isCivilian) && (
              <RadioGroup
                title="É voluntário civil"
                name="isCivilVolunteer"
                options={civilVolunteerOptions}
                errors={errors}
                register={register}
              />
            )
          }
          <div className={styles.buttonsBox}>
            <Button
              type="submit"
              name="Enviar"
            />
            <Button
              type="button"
              name="Voltar"
              onClick={returnToDashboard}
            />
          </div>
        </>
      )}
    </>)
}