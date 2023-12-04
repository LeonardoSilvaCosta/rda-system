import { useEffect, useState } from 'react';
import { Control, UseFormRegister } from 'react-hook-form';

import styles from './styles.module.scss';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { LoadingComponent } from '@/components/Loading/loading';
import { MaskedInput } from '@/components/MaskedInput';
import { MyCustomDropdown } from '@/components/MyCustomDropdown';
import { useRegisterClientContext } from '@/context/registerClientContext';
import { ClientFormValues, Option } from '@/types/types';

interface SecondClientFormProps {
  control: Control<ClientFormValues>;
  register: UseFormRegister<ClientFormValues>;
}

export function SecondClientForm({ control, register }: SecondClientFormProps) {
  const { clearErrors, errors, getValues, setValue, goToPreviousStep } =
    useRegisterClientContext();
  const [isLoading, setIsLoading] = useState(true);
  const [states, setStates] = useState<Option[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const [cities, setCities] = useState<Option[]>([]);

  useEffect(() => {
    const getLists = async () => {
      try {
        const resStates = await fetch('/api/get_ufs');
        const states = await resStates.json();
        setStates(states);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    getLists();
  }, []);

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
        console.error('Erro ao buscar cidades:', error);
      });
  };

  useEffect(() => {
    const stateAcronym = getValues('address.stateAcronym');

    if (selectedState) {
      selectCities(selectedState);
    } else if (stateAcronym) {
      selectCities(stateAcronym);
    } else {
      setCities([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getAddressInfo = async (e: any): Promise<void> => {
    try {
      const cep = e.target.value.replace(/\D/g, '');
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const address = await res.json();
      setValue('address.street', address.logradouro);
      setValue('address.neighborhood', address.bairro);
      setValue('address.complement', address.complemento);

      clearErrors();

      const uf = states.find((e) => e.name === address.uf);
      if (uf) {
        setValue('address.stateAcronym', uf.id);
        setSelectedState(uf.id);

        selectCities(uf.id, address.localidade);
      } else {
        setSelectedState('');
        setCities([]);
      }
    } catch (error) {
      console.log(`Não foi possível encontrar o cep informado.`);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <>
          <MaskedInput
            title="CEP"
            name="address.zipCode"
            type="text"
            hint="00035-510"
            errors={errors}
            register={register}
            onBlur={getAddressInfo}
            mask={'99999-999'}
          />
          <Input
            title="Logradouro*"
            name="address.street"
            type="text"
            hint="Rua Satélite"
            errors={errors}
            register={register}
          />
          <Input
            title="Bairro*"
            name="address.neighborhood"
            type="text"
            hint="Parque verde"
            errors={errors}
            register={register}
          />
          <Input
            title="Número*"
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
            title="Estado*"
            fieldName="address.stateAcronym"
            options={states}
            getValues={getValues}
            errors={errors}
            control={control}
            setSelectedState={setSelectedState}
            routeToSearch={'/api/get_ufs'}
          />
          <MyCustomDropdown
            title="Cidade*"
            fieldName="address.city"
            options={cities}
            getValues={getValues}
            errors={errors}
            control={control}
            routeToSearch={`/api/get_cities_from_uf?ufId=${selectedState}&`}
          />
          <div className={styles.buttonsBox}>
            <Button type="button" name="Voltar" onClick={goToPreviousStep} />
            <Button type="submit" name="Próxima" />
          </div>
        </>
      )}
    </>
  );
}
