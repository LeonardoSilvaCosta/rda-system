import * as yup from "yup"

export const stepOneValidation = yup.object().shape({
  data: yup.date().required("O campo 'Data' é obrigatório.").default(null),
  horario: yup.string().required("O campo 'Horário' é obrigatório."),
  recepcionista: yup.string().required("O campo 'Recepcionista' é obrigatório."),
  oficial: yup.string().required("O campo 'Oficial' é obrigatório"),
  acesso: yup.string().required("O campo 'Acesso' é obrigatório"),
  local: yup.string().required("O campo 'Local' é obrigatório"),
  temProtocolo: yup.string().required("O campo 'Tem protocolo' é obrigatório."),
  modalidade: yup.string().required("O campo 'Modalidade' é obrigatório"),
  protocolo: yup.string().when('temProtocolo', {
    is: "Sim",
    then: () => yup.string().required("O campo 'Protocolo' é obrigatório."),
    otherwise: () => yup.string(),
  }).default("Não se aplica"),
})

export const stepTwoValidation = yup.object({
  identificacaoPM: yup.string().required("O campo 'Identificação' do PM é obrigatório."),
  opm: yup.string().required("O campo 'OPM' é obrigatório."),
  sexoPM: yup.string().required("O campo 'Sexo' do PM é obrigatório."),
  dataDeNascimentoPM: yup.date().required("O campo 'Data de nascimento' do PM é obrigatório."),
  cidadeEmQueResidePM: yup.string().required("O campo 'Cidade' do PM é obritatório."),
  estadoCivilPM: yup.string().required("O campo 'Estado civil' do PM é obrigatório."),
  eDependente: yup.string().required("O campo que define se o atendimento é para dependente é obrigatório."),
})

export const stepThreeValidation = yup.object({
  identificacaoDependente: yup.string().when('eDependente', {
    is: "Sim",
    then: () => yup.string().required("O campo Identificação do dependente é obrigatório."),
    otherwise: () => yup.string(),
  }).default("Não se aplica"),
  sexoDependente: yup.string().when('eDependente', {
    is: "Sim",
    then: () => yup.string().required("O campo Sexo do dependente é obrigatório."),
    otherwise: () => yup.string(),
  }).default("Não se aplica"),
  dataDeNascimentoDependente: yup.date().nullable().when('eDependente', {
    is: "Sim",
    then: () => yup.date().required("O campo Data de nascimento do dependente é obrigatório").nullable()
  }).default(null),
  cidadeEmQueResideDependente: yup.string().when('eDependente', {
    is: "Sim",
    then: () => yup.string().required("O campo cidade de residência do dependente é obrigatório."),
    otherwise: () => yup.string(),
  }).default("Não se aplica"),
  estadoCivilDependente: yup.string().when('eDependente', {
    is: "Sim",
    then: () => yup.string().required("O campo Estado civil do dependente é obrigatório."),
    otherwise: () => yup.string(),
  }).default("Não se aplica"),
})

export const stepFourValidation = yup.object({
  tipoDeServico: yup.string().required("O campo Tipo de serviço é obrigatório."),
  tipoDeAvaliacaoPsicologica: yup.string().when('tipoDeServico', {
    is: "Avaliação psicológica",
    then: () => yup.string().required("O campo Tipo de Avaliação psicológica é obrigatório."),
    otherwise: () => yup.string(),
  }).default("Não se aplica"),
  tipoDeAvaliacaoSocial: yup.string().when('tipoDeServico', {
    is: "Avaliação social",
    then: () => yup.string().required("O campo Tipo de Avaliação social é obrigatório."),
    otherwise: () => yup.string(),
  }).default("Não se aplica"),
  demandaGeral: yup.string().required("O campo Demanda geral é obrigatório."),
  tiposDeDemandaEspecifica: yup.array().required("o campo Demandas específicas é obrigatório."),
  procedimento: yup.string().required("O campo Procedimento é obrigatório."),
  documentosProduzidos: yup.array().required("O campo Documentos produzidos é obrigatório."),
  deslocamentos: yup.array().required("O campo Deslocamentos é obrigatório."),
  houveAfastamento: yup.string().required("O campo que se refere se houve ou não afastamento é obrigatório."),
})

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
  workStatus: yup.string().required("O campo 'Situação funcional' é obrigatório.")
})

export const dependentFormValidation = yup.object({
  fullName: yup.string().required("O campo 'Nome completo' é obrigatório."),
  policyHolder: yup.string().required("O campo 'titular' é obrigatório."),
  familiarBond: yup.string().required("O campo 'vínculo é obrigatório.'"),
  gender: yup.string().required("O campo 'Gênero' é obrigatório."),
  cpf: yup.string().required("O campo 'CPF' é obrigatório."),
  birthDate: yup.date().required("O campo 'Data de nascimento' é obrigatório."),
  maritalStatus: yup.string().required("O campo 'Estado civil' é obrigatório."),
  isCivilVolunteer: yup.string().required("O campo é voluntário é obrigatório.")
})

export const citizenFormValidation = yup.object({
  fullName: yup.string().required("O campo 'Nome completo' é obrigatório."),
  gender: yup.string().required("O campo 'Sexo' é obrigatório."),
  cpf: yup.string().required("O campo 'CPF' é obrigatório."),
  birthDate: yup.date().required("O campo 'Data de nascimento' é obrigatório."),
  maritalStatus: yup.string().required("O campo 'Estado civil' é obrigatório."),
  isCivilVolunteer: yup.string().required("O campo é voluntário é obrigatório.")
})

export const firstFormValidations = {
  militar: militaryFormValidation,
  dependente: dependentFormValidation,
  'civil-sem-vínculo': citizenFormValidation
}

const address = yup.object({
  zipCode: yup.string().required("O campo 'CEP' é obrigatório"),
  street: yup.string().required("O campo 'Logradouro' é obrigatório"),
  neighborhood: yup.string().required("O campo 'Bairro' é obrigatório"),
  number: yup.string().required("O campo 'Número' é obrigatório."),
  stateAcronym: yup.string().required("O campo 'UF' é obrigatório"),
  city: yup.string().required("O campo 'Cidade' é obrigatório.")
})

const contacts = yup.object({
  phone: yup.string().required("O campo 'Número de telefone' é obrigatório"),
  ownerIdentification: yup.string().required("O campo 'Identificação do dono do celular' é obrigatório"),
  attendedRelationship: yup.string().nullable(),
  attendedId: yup.string().nonNullable(),
})

export const addressFormValidation = yup.object({
  address,
})

export const contactFormValidation = yup.object({
  contacts: yup.lazy((value) => {
    if (Array.isArray(value)) {
      return yup.array().of(contacts);
    } else {
      return yup.mixed();
    }
  }),
})