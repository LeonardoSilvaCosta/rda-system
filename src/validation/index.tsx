import * as yup from "yup"

export const schema = yup
  .object({
    data: yup.date().required("O campo data é obrigatório.").default(null),
    horario: yup.string().required("O campo horário é obrigatório."),
    recepcionista: yup.string().required("O campo recepcionista é obrigatório."),
    oficial: yup.string().required("O campo oficial é obrigatório"),
    acesso: yup.string().required("O campo acesso é obrigatório"),
    local: yup.string().required("O campo local é obrigatório"),
    temProtocolo: yup.string().required("O campo 'Tem protocolo' é obrigatório."),
    modalidade: yup.string().required("O campo modalidade é obrigatório"),
    protocolo: yup.string().when('temProtocolo', {
      is: "Sim",
      then: () => yup.string().required("O campo protocolo é obrigatório."),
      otherwise: () => yup.string(),
    }).default("Não se aplica"),
    identificacaoPM: yup.string().required(),
    opm: yup.string().required(),
    sexoPM: yup.string().required(),
    dataDeNascimentoPM: yup.date().required(),
    cidadeEmQueResidePM: yup.string().required(),
    estadoCivilPM: yup.string().required(),
    eDependente: yup.string().required(),
    identificacaoDependente: yup.string().when('eDependente', {
      is: "Sim",
      then: () => yup.string().required("O campo Identificação é obrigatório."),
      otherwise: () => yup.string(),
    }).default("Não se aplica"),
    sexoDependente: yup.string().when('eDependente', {
      is: "Sim",
      then: () => yup.string().required("O campo Sexo é obrigatório."),
      otherwise: () => yup.string(),
    }).default("Não se aplica"),
    dataDeNascimentoDependente: yup.date().nullable().when('eDependente', {
      is: "Sim",
      then: () => yup.date().required("O campo Data de nascimento é obrigatório").nullable()
    }).default(null),
    cidadeEmQueResideDependente: yup.string().when('eDependente', {
      is: "Sim",
      then: () => yup.string().required("O campo Cidade em que reside é obrigatório."),
      otherwise: () => yup.string(),
    }).default("Não se aplica"),
    estadoCivilDependente: yup.string().when('eDependente', {
      is: "Sim",
      then: () => yup.string().required("O campo Estado civil é obrigatório."),
      otherwise: () => yup.string(),
    }).default("Não se aplica"),
    tipoDeServico: yup.string().required(),
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
    demandaGeral: yup.string().required(),
    tiposDeDemandaEspecifica: yup.array().required(),
    procedimento: yup.string().required(),
    documentosProduzidos: yup.array().required(),
    deslocamentos: yup.array().required(),
    houveAfastamento: yup.string().required(),
  })

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
