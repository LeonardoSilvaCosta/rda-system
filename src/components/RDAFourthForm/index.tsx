import styles from './styles.module.scss';
import { Button } from "../Button";
import { MyCustomDropdown } from "../MyCustomDropdown";
import { listAvaliacoeSociais, listAvaliacoesPsi, listDemandasEspecificas, listDemandasGerais, listDeslocamentos, listDocumentos, listProcedimentos, listServicos } from "@/data";
import { MyCustomMultiSelectDropdown } from "../MyCustomMultiselectDropdown";
import { RadioGroup } from "../RadioGroup";
import { FormValues } from "@/types/types";
import { Control, UseFormRegister } from 'react-hook-form';

interface FourthFormProps {
  register: UseFormRegister<FormValues>,
  control: Control<FormValues>,
}

export function RDAFourthForm({ register, control }: FourthFormProps) {
  return (
    <>
      <h2><span>Dados do atendimento</span></h2>
      <MyCustomDropdown
        title="Tipo de serviço"
        fieldName="tipoDeServico"
        options={listServicos}
        control={control}
      />
      <MyCustomDropdown
        title="Tipo de avaliação psicológica"
        fieldName="tipoDeAvaliacaoPsicologica"
        options={listAvaliacoesPsi}
        control={control}
      />
      <MyCustomDropdown
        title="Tipo de avaliação social"
        fieldName="tipoDeAvaliacaoSocial"
        options={listAvaliacoeSociais}
        control={control}
      />
      <MyCustomDropdown
        title="Demanda geral"
        fieldName="demandaGeral"
        options={listDemandasGerais}
        control={control}
      />
      <MyCustomMultiSelectDropdown
        title="Tipo de demanda específica"
        fieldName="tiposDeDemandaEspecifica"
        options={listDemandasEspecificas}
        control={control}
      />
      <MyCustomDropdown
        title="Procedimento"
        fieldName="procedimento"
        options={listProcedimentos}
        control={control}
      />
      <MyCustomMultiSelectDropdown
        title="Documentos produzidos"
        fieldName="documentosProduzidos"
        options={listDocumentos}
        control={control}
      />
      <MyCustomMultiSelectDropdown
        title="Deslocamentos"
        fieldName="deslocamentos"
        options={listDeslocamentos}
        control={control}
      />
      <RadioGroup
        title="Houve afastamento?"
        label1="Sim"
        label2="Não"
        name="houveAfastamento"
        register={register} required
      />

      <div className={styles.buttonsBox}>
        <Button
          type="submit"
        />
        <Button
          type="button"
        />
      </div>
    </>)
}