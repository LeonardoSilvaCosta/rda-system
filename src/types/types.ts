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
  bond: string;
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

export type GenericPerson = {
  id: string;
  avatar?: string;
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
  specialists: string[];
  attendeds: string[];
  access: string;
  facility: string;
  modality: string;
  hasProgram: string;
  program: string;
  hasProtocol: string;
  protocol: string | null;
  service: string;
  psychologicalAssessment: string | null;
  socialAssessment: string | null;
  generalDemand: string;
  specificDemands: string[];
  procedure: string;
  employmentStatus: string | null;
  hasFirstOptionWithoutSecondOption: boolean;
  referrals: Referral[];
  producedDocuments: string[];
  travels: string[];
  hasLeaveOfAbsence: string;
  hospitalization: string;
  recordProgress: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type UserFormValues = {
  avatar: FileList;
  fullName: string;
  nickName: string;
  rg: string;
  rank: string;
  cadre: string;
  gender: string;
  email: string;
  cpf: string;
  professionalRegistration: string;
  birthDate: string;
  maritalStatus: string;
  contacts: Contact[];
  address: Address;
  opm: string;
  isMilitary: string;
  workStatus: string;
};

export type Referral = { firstOptionId: string; secondOptionId: string };

export type HeaderData = {
  avatar: string;
  fullname: string;
};

export type GeneralData = {
  birthDate: KeyValue;
  age: KeyValue;
  cpf: KeyValue;
  maritalStatus: KeyValue;
  rg: KeyValue;
  nickname: KeyValue;
  rank: KeyValue;
  cadre: KeyValue;
  workStatus: KeyValue;
  opm: KeyValue;
  gender: KeyValue;
  isCivilVolunteer: KeyValue;
};

export type AddressData = {
  zipCode: KeyValue;
  street: KeyValue;
  neighborhood: KeyValue;
  number: KeyValue;
  complement: KeyValue;
  city_state: KeyValue;
};

export type KeyValue = {
  key: string;
  value: string;
};

export type AttendedKeyValue = {
  headerData: HeaderData;
  generalData: GeneralData;
  addressData: AddressData;
  contactsData: KeyValue[];
  dependentsData: KeyValue[];
  policyHolder: KeyValue;
};

export type Attended = {
  id: string;
  fullname: string;
  nickname: string | null;
  rg: string | null;
  cpf: string;
  birthDate: string;
  avatar: string | null;
  isCivilVolunteer: boolean;
  rank: string | null;
  cadre: string | null;
  opm: string | null;
  gender: string;
  maritalStatus: string;
  workStatus: string | null;
  familiarBond: string | null;
  address: {
    zipCode: string;
    number: string;
    street: string;
    complement: string | null;
    neighborhood: string;
    city_id: string;
    city: string;
    state_id: string;
    stateAcronym: string;
  };
  phones: {
    phone: string;
    ownerIdentification: string;
    bond_id: string | null;
    bond: string | null;
  }[];
  policyHolder: PolicyHolder;
  dependents: Dependent[];
};

export type PolicyHolder = {
  rank: string | null;
  cadre: string | null;
  rg: string | null;
  nickname: string | null;
  cpf: string | null;
};

export type Dependent = {
  id: string | null;
  cpf: string | null;
  fullname: string | null;
  familiarBond: string | null;
};

export type Appointment = {
  id: string;
  date: string;
  time: string;
  protocol: string | null;
  hasLeaveOfAbsence: boolean;
  hospitalization: boolean;
  recordProgress: string;
  access: string;
  facility: string;
  modality: string;
  program: string;
  service: string;
  psychologicalAssessment: string | null;
  socialAssessment: string | null;
  generalDemand: string | null;
  procedure: string;
  employmentStatus: string;
  specialists: ProfessionalIdentification[];
  attendeds: AttendedIdentification[];
  specificDemands: [] | null;
  producedDocuments: [] | null;
  travels: [] | null;
  referralDestinations: [] | null;
  referralTypes: [] | null;
  isSigned: boolean;
};

export type AttendedIdentification = {
  rank: string | null;
  cadre: string | null;
  rg: string | null;
  nickname: string | null;
  cpf: string;
  fullname: string;
};

export type ProfessionalIdentification = {
  rank: string | null;
  cadre: string | null;
  rg: string | null;
  nickname: string | null;
  cpf: string;
  fullname: string;
  professionalRegistration: string | null;
};

export type PopulateFormData = {
  id: string;
  ordenation: number;
  name: string;
  source: string;
};

export type QueryObject = {
  id: string;
  name: string;
  nickname: string;
  fullname: string;
  cpf: string;
  rg: string;
  cadre: string;
  rank: string;
};

export type FileData = {
  id: string;
  filename: string;
  originalName: string;
  attended: GenericPerson;
  appointmentId: string;
  user: GenericPerson;
  url: string;
  specie: string;
  path: string;
  bucketName: string;
  createdAt: string;
};

export type UpdateClientGeneralDataFormValues = {
  nickName: string;
  rank: string;
  cadre: string;
  gender: string;
  maritalStatus: string;
  opm: string;
  workStatus: string;
  isCivilVolunteer: string;
};

export type CurrentScreen =
  | 'profile'
  | 'update Dados gerais'
  | 'update Endereço'
  | 'update Contatos';
