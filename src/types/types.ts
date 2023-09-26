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
  nomeCompleto: string;
  sexo: string;
  dataDeNascimento: string;
  estadoCivil: string;
  rg: string;
  cpf: string;
  cmd: string;
  opm: string;
  rank: string;
  eMilitar: string;
  cidadeEmQueReside: string;
}