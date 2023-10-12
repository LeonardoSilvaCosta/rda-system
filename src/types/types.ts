import { Control, FieldPath, Path, UseFormRegister } from "react-hook-form";

export type FormValues = {
  data: Date;
  horario: string;
  recepcionista: string;
  oficial: string;
  acesso: string;
  local: string;
  temProtocolo: string;
  modalidade: string;
  protocolo: string;
  identificacaoPM: string;
  opm: string;
  sexoPM: string;
  dataDeNascimentoPM: Date;
  cidadeEmQueResidePM: string;
  estadoCivilPM: string;
  eDependente: string;
  identificacaoDependente: string;
  sexoDependente: string;
  dataDeNascimentoDependente: Date | null;
  cidadeEmQueResideDependente: string;
  estadoCivilDependente: string;
  tipoDeServico: string;
  tipoDeAvaliacaoPsicologica: string;
  tipoDeAvaliacaoSocial: string;
  demandaGeral: string;
  tiposDeDemandaEspecifica: string[];
  procedimento: string;
  documentosProduzidos: string[];
  deslocamentos: string[];
  houveAfastamento: string;
}

export type ClientFormValues = {
  fullName: string;
  nickName: string;
  rg: string;
  rank: string;
  cadre: string;
  gender: string;
  cpf: string;
  birthDate: string;
  maritalStatus: string;
  contacts: Contact[];
  address: Address;
  opm: string;
  policyHolder: string;
  isCivilVolunteer: string;
  familiarBond: string;
  workStatus: string;
}

export type Contact = {
  phone: string;
  ownerIdentification: string;
  attendedRelationship: string;
  attended_id: string;
}

export type Address = {
  zipCode: string;
  street: string;
  neighborhood: string;
  number: string;
  complement: string;
  stateAcronym: string;
  city: string;
}

export type ClientCardType = {
  fullname: string;
  rank: string;
  cadre: string;
  rg: string;
  nickname: string;
  cpf: string;
}

export type Option = {
  id: string;
  name: string;
}

export type City = {
  id: string;
  name: string;
  state_name: string;
  state_acronym: string;
  state_id: string;
}

export type Military = {
  id: string;
  fullname: string;
  nickname: string;
  rg: string;
  rank: string;
  cadre: string;
  cpf: string;
}

export type AppointmentFormValues = {
  date: string;
  time: string;
  specialists: Option[];
  attendeds: Option[];
  access: string;
  facility: string;
  modality: string;
  hasProtocol: string;
  protocol: string;
  typeOfService: string;
  typeOfPsychologicalAssessment: string;
  typeOfSocialAssessment: string;
  generalDemand: string;
  specificDemands: Option[];
  procedure: string;
  referrals: Referrals;
  documents: Option[];
  travels: Option[];
  hasLeaveOfAbsence: string;
}

type Referrals = {
  destinations: Option[],
  types: Record<string, Option[]>
}

export type NameType = Path<FormValues> | Path<ClientFormValues>;
export type RegisterType = UseFormRegister<ClientFormValues> | UseFormRegister<FormValues>;
export type FieldType = FieldPath<ClientFormValues> | FieldPath<FormValues>;
export type ControlType = Control<ClientFormValues> | Control<FormValues>;
