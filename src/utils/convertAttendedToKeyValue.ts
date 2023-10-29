import { calculateAge } from './calculateAge';
import { formatDate } from './formatDateTime';

import { Attended } from '@/types/types';

export const convertAttendedToKeyValues = (attended: Attended) => {
  const emptyValue = { key: '', value: '' };
  const keyValues = {
    id: attended.id,
    headerData: {
      avatar: attended.avatar ? attended.avatar : '',
      fullname: attended.fullname
    },
    generalData: {
      birthDate: {
        key: 'Data de nascimento',
        value: attended.birthDate ? formatDate(attended.birthDate) : ''
      },
      age: {
        key: 'Idade',
        value: calculateAge(new Date(attended.birthDate))
      },
      cpf: { key: 'CPF', value: attended.cpf },
      maritalStatus: attended.maritalStatus
        ? { key: 'Estado civil', value: attended.maritalStatus }
        : emptyValue,
      gender: attended.gender
        ? { key: 'Sexo', value: attended.gender }
        : emptyValue,
      isCivilVolunteer: attended.rg
        ? emptyValue
        : {
            key: 'É voluntário Civil',
            value: attended.isCivilVolunteer ? 'Sim' : 'Não'
          },
      rg: attended.rg ? { key: 'RG', value: attended.rg } : emptyValue,
      nickname: attended.nickname
        ? { key: 'Nome de guerra', value: attended.nickname }
        : emptyValue,
      rank: attended.rank
        ? { key: 'Posto/graduação', value: attended.rank }
        : emptyValue,
      cadre: attended.cadre
        ? { key: 'Quadro', value: attended.cadre }
        : emptyValue,
      workStatus: attended.workStatus
        ? {
            key: 'Condição funcional',
            value: attended.workStatus
          }
        : emptyValue,
      opm: attended.opm ? { key: 'OPM', value: attended.opm } : emptyValue
    },
    addressData: {
      zipCode: { key: 'CEP', value: attended.address.zipCode },
      street: { key: 'Logradouro', value: attended.address.street },
      complement: attended.address.complement
        ? {
            key: 'Complemento',
            value: attended.address.complement
          }
        : emptyValue,
      number: {
        key: 'Número',
        value: attended.address.number
      },
      neighborhood: {
        key: 'Bairro',
        value: attended.address.neighborhood
      },
      city_state: {
        key: 'Cidade/Estado',
        value: 'Belém/PA'
      }
    },
    contactsData: attended.phones
      ? attended.phones.map((e) => {
          return {
            key: 'Telefone',
            value: e.attendedRelationship
              ? `${e.phone} - ${e.ownerIdentification} (${e.attendedRelationship})`
              : `${e.phone} (${e.ownerIdentification})`
          };
        })
      : [],
    dependentsData:
      attended.dependents.length > 0
        ? attended.dependents.map((e) => {
            return {
              key: 'Dependentes',
              value: `${e.fullname} - ${e.cpf} (${e.familiarBond})`
            };
          })
        : [],
    policyHolder: attended.policyHolder.rg
      ? {
          key: 'Titular',
          value: `${attended.policyHolder.rank} ${attended.policyHolder.cadre} ${attended.policyHolder.rg} ${attended.policyHolder.nickname}`
        }
      : emptyValue
  };

  return keyValues;
};
