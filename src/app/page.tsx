import { Header } from "@/components/Header";
import { Input } from "@/components/Input";

import styles from './styles.module.scss';
import { Button } from "@/components/Button";
import { MyDatePicker } from "@/components/MyDatePicker";
import { DropDown } from "@/components/DropDown";
import { RadioButton } from "@/components/RadioButton";
import { RadioGroup } from "@/components/RadioGroup";

export default function Home() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2><span>Dados gerais</span></h2>
        <form className={styles.form}>
          <MyDatePicker title="Data" />
          {/* <Input title="Data do atendimento" type="date" hint="20/01/2023" name="data" /> */}
          <Input title="Horário" type="time" hint="11:00" name="horario" />
          <DropDown id="recepcionista" title="Recepcionista" />
          <DropDown id="oficial" title="Oficial" />
          <DropDown id="acesso" title="Acesso ao atendimento" />
          <DropDown id="local" title="Local do atendimento" />
          <RadioGroup title="Modalidade de atendimento" name="modalidade" label1="Sim" label2="Não" />
          <div className={styles.buttonsBox}>
            <Button name="Próxima" />
            <Button name="Cancelar" />
          </div>
        </form>
      </div>
    </>
  )
}
