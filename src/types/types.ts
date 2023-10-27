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
  specialists: string[];
  attendeds: string[];
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

export type Appointment = {
  id: string;
  date: string;
  time: string;
  protocol: string | null;
  has_leave_of_absence: boolean;
  record_progress: string;
  access: string;
  facility: string;
  modality: string;
  service: string;
  psychological_assessment: string | null;
  social_assessment: string | null;
  general_demand: string;
  procedure: string;
  specialists: Specialist[];
  attendeds: {
    rank: string | null;
    cadre: string | null;
    rg: string | null;
    nickname: string | null;
    cpf: string;
    fullname: string;
  }[];
  specific_demand: [] | null;
  documents: [] | null;
  travels: [] | null;
  referral_destinations: [] | null;
  referral_types: [] | null;
};

export type Specialist = {
  rank: string | null;
  cadre: string | null;
  rg: string | null;
  nickname: string | null;
};
