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
  cityOfResidence: string;
  cmd: string;
  opm: string;
  policyHolder: string;
  isMilitary: string;
  isCivilVolunteer: string;
}

export type NameType = Path<FormValues> | Path<ClientFormValues>;
export type RegisterType = UseFormRegister<ClientFormValues> | UseFormRegister<FormValues>;
export type FieldType = FieldPath<ClientFormValues> | FieldPath<FormValues>;
export type ControlType = Control<ClientFormValues> | Control<FormValues>;

export type ClientCardType = {
  fullname: string;
  posto_grad: string;
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
}

export type Military = {
  id: string;
  fullname: string;
  nickname: string;
  rg: string;
  rank: string;
  cadre: string;
}