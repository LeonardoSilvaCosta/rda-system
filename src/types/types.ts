import { Control, FieldPath, Path, UseFormRegister } from 'react-hook-form';

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
};

export type Address = {
  zipCode: string;
  street: string;
  neighborhood: string;
  number: string;
  complement: string;
  stateAcronym: string;
  city: string;
};

export type Contact = {
  phone: string;
  ownerIdentification: string;
  attendedRelationship: string;
  attended_id: string;
};

export type ClientCardType = {
  fullname: string;
  rank: string;
  cadre: string;
  rg: string;
  nickname: string;
  cpf: string;
};

export type Option = {
  id: string;
  name: string;
};

export type City = {
  id: string;
  name: string;
  state_name: string;
  state_acronym: string;
  state_id: string;
};

export type Military = {
  id: string;
  fullname: string;
  nickname: string;
  rg: string;
  rank: string;
  cadre: string;
  cpf: string;
};

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
  specificDemands: string[];
  procedure: string;
  hasFirstOptionWithoutSecondOption: boolean;
  referrals: Referral[];
  documents: string[];
  travels: string[];
  hasLeaveOfAbsence: string;
  recordProgress: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type Referral = { firstOptionId: string; secondOptionId: string };
