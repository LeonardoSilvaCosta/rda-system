import * as yup from 'yup';

export const militaryFormValidation = yup.object({
  fullName: yup.string().required("O campo 'Nome completo' é obrigatório."),
  nickName: yup.string().required("O campo 'Nome de guerra' é obrigatório."),
  rg: yup.string().required("O campo 'RG' é obrigatório."),
  rank: yup.string().required("O campo 'Posto/graduação' é obrigatório."),
  cadre: yup.string().required("O campo 'Quadro' é obrigatório."),
  gender: yup.string().required("O campo 'Gênero' é obrigatório."),
  cpf: yup.string().required("O campo 'CPF' é obrigatório."),
  birthDate: yup.date().required("O campo 'Data de nascimento' é obrigatório."),
  maritalStatus: yup.string().required("O campo 'Estado civil' é obrigatório."),
  opm: yup.string().required("O campo 'OPM' é obrigatório."),
  workStatus: yup
    .string()
    .required("O campo 'Situação funcional' é obrigatório.")
});

export const dependentFormValidation = yup.object({
  fullName: yup.string().required("O campo 'Nome completo' é obrigatório."),
  policyHolder: yup.string().required("O campo 'titular' é obrigatório."),
  familiarBond: yup.string().required("O campo 'vínculo é obrigatório.'"),
  gender: yup.string().required("O campo 'Gênero' é obrigatório."),
  cpf: yup.string().required("O campo 'CPF' é obrigatório."),
  birthDate: yup.date().required("O campo 'Data de nascimento' é obrigatório."),
  maritalStatus: yup.string().required("O campo 'Estado civil' é obrigatório."),
  isCivilVolunteer: yup
    .string()
    .required("O campo 'É voluntário civil' é obrigatório.")
});

export const citizenFormValidation = yup.object({
  fullName: yup.string().required("O campo 'Nome completo' é obrigatório."),
  gender: yup.string().required("O campo 'Sexo' é obrigatório."),
  cpf: yup.string().required("O campo 'CPF' é obrigatório."),
  birthDate: yup.date().required("O campo 'Data de nascimento' é obrigatório."),
  maritalStatus: yup.string().required("O campo 'Estado civil' é obrigatório."),
  isCivilVolunteer: yup.string().required('O campo é voluntário é obrigatório.')
});

export const firstClientFormValidations = {
  militar: militaryFormValidation,
  dependente: dependentFormValidation,
  'civil-sem-vínculo': citizenFormValidation
};

const address = yup.object({
  zipCode: yup.string().required("O campo 'CEP' é obrigatório"),
  street: yup.string().required("O campo 'Logradouro' é obrigatório"),
  neighborhood: yup.string().required("O campo 'Bairro' é obrigatório"),
  number: yup.string().required("O campo 'Número' é obrigatório."),
  complement: yup.string().nullable(),
  stateAcronym: yup.string().required("O campo 'UF' é obrigatório"),
  city: yup.string().required("O campo 'Cidade' é obrigatório.")
});

const contacts = yup.object({
  phone: yup.string().required("O campo 'Número de telefone' é obrigatório"),
  ownerIdentification: yup
    .string()
    .required("O campo 'Identificação do dono do celular' é obrigatório"),
  bond: yup.string().nullable(),
  attendedId: yup.string().nonNullable()
});

export const addressFormValidation = yup.object({
  address
});

export const contactFormValidation = yup.object({
  contacts: yup.lazy((value) => {
    if (Array.isArray(value)) {
      return yup.array().of(contacts);
    } else {
      return yup.mixed();
    }
  })
});

const psychologicalId = '8f911cb1-9a72-4765-bf84-1c273eab0139';
const socialId = '736eb33d-b012-46e2-9443-29858b965337';
const saeId = '2451d79f-f67e-4b7f-b8b2-2fefdb841c84';

export const firstAppointmentStepValidation = yup.object({
  date: yup.date().required("O campo 'Data' é obrigatório."),
  time: yup.string().required("O campo 'Horário' é obrigatório."),
  specialists: yup
    .array()
    .of(yup.string())
    .required("O campo 'Oficiais' é obrigatório")
    .default([]),
  attendeds: yup
    .array()
    .of(yup.string())
    .required("O campo 'Atendidos' é obrigatório")
    .default([]),
  access: yup
    .string()
    .required("O campo 'Acesso' ao atendimento' é obrigatório"),
  facility: yup
    .string()
    .required("O campo 'Local' do atendimento' é obrigatório"),
  modality: yup.string().required("O campo 'Modalidade' é obrigatório"),
  program: yup.string().required("O campo 'Programa' é obrigatório"),
  hasProtocol: yup
    .string()
    .required("O campo 'Tem protocolo PAE?' é obrigatório."),
  protocol: yup
    .string()
    .when('hasProtocol', {
      is: 'Sim',
      then: () => yup.string().required("O campo 'Protocolo' é obrgatório."),
      otherwise: () => yup.string().nullable()
    })
    .default(null)
});

const Referral = yup.object({
  firstOption: yup.string(),
  secondOption: yup.string()
});

export const secondAppointmentStepValidation = yup.object({
  service: yup.string().required("O campo 'Tipo de serviço' é obrigatório."),
  psychologicalAssessment: yup
    .string()
    .when('service', {
      is: psychologicalId,
      then: () =>
        yup
          .string()
          .required("O campo 'Tipo de avaliação psicológica' é obrigatório"),
      otherwise: () => yup.string().nullable()
    })
    .default(null),
  socialAssessment: yup
    .string()
    .when('service', {
      is: socialId,
      then: () =>
        yup
          .string()
          .required("O campo 'Tipo de avaliação social' é obrigatório"),
      otherwise: () => yup.string().nullable()
    })
    .default(null),
  employmentStatus: yup
    .string()
    .when('service', {
      is: saeId,
      then: () =>
        yup.string().required("O campo 'Condição laboral' é obrigatório"),
      otherwise: () => yup.string().nullable()
    })
    .default(null),
  generalDemand: yup.string().required("O campo 'Demanda Geral' é obrigatório"),
  specificDemands: yup.array(yup.string()).default([]),
  procedure: yup.string().required("O campo 'Procedimento' é obrigatório"),
  documents: yup.array(yup.string()).default([]),
  travels: yup.array().of(yup.string()).default([]),
  hasFirstOptionWithoutSecondOption: yup
    .boolean()
    .isFalse('Informe o tipo de encaminhamento.'),
  referrals: yup.array().of(Referral).default([]),
  hasLeaveOfAbsence: yup
    .string()
    .required("O campo 'Houve afastamento?' é obrigatório."),
  hospitalization: yup
    .string()
    .when('service', {
      is: saeId,
      then: () =>
        yup.string().required("O campo 'Houve internação?' é obrigatório"),
      otherwise: () => yup.string().nullable()
    })
    .default(null),
  recordProgress: yup.string().required("O campo 'Evolução' é obrigatório.")
});

export const loginValidation = yup.object({
  email: yup
    .string()
    .email('O email deve ser válido.')
    .required("O campo 'email' é obrigatório"),
  password: yup.string().required("O campo 'senha' é obrigatório.")
});

export const firstUserFormValidation = yup.object({
  isMilitary: yup.string().required('Este campo é obrigatório.')
});

const QCOPMId = 'df4281a9-d27f-42b8-baf9-fcf9d58d055e';

export const secondUserFormValidation = yup.object({
  fullName: yup.string().required("O campo 'Nome completo' é obrigatório."),
  nickName: yup.string().required("O campo 'Nome de guerra' é obrigatório."),
  rg: yup
    .string()
    .required()
    .when('isMilitary', {
      is: 'Sim',
      then: () => yup.string().required("O campo 'RG' é obrigatório."),
      otherwise: () => yup.string().nullable()
    })
    .default(null),
  rank: yup
    .string()
    .required()
    .when('isMilitary', {
      is: 'Sim',
      then: () =>
        yup.string().required("O campo 'Posto/graduação' é obrigatório."),
      otherwise: () => yup.string().nullable()
    })
    .default(null),
  cadre: yup.string().required("O campo 'Quadro' é obrigatório."),
  gender: yup.string().required("O campo 'Gênero' é obrigatório."),
  email: yup.string().required("O campo 'Email' é obrigatório."),
  cpf: yup.string().required("O campo 'CPF' é obrigatório."),
  professionalRegistration: yup.string().when('cadre', {
    is: QCOPMId,
    then: () =>
      yup
        .string()
        .required("O campo 'Registro' é obrigatório")
        .matches(
          /^(10|1)\/\d+$/,
          "Deve começar com '10/' ou '1/' e conter números após a barra"
        ),
    otherwise: () => yup.string().nullable()
  }),
  birthDate: yup.date().required("O campo 'Data de nascimento' é obrigatório."),
  maritalStatus: yup.string().required("O campo 'Estado civil' é obrigatório."),
  opm: yup.string().required("O campo 'OPM' é obrigatório."),
  workStatus: yup
    .string()
    .required("O campo 'Situação funcional' é obrigatório.")
});
