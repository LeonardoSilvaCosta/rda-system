import { Header } from "@/components/Header";
import { Input } from "@/components/Input";

import styles from './styles.module.scss';
import { Button } from "@/components/Button";
import { MyDatePicker } from "@/components/MyDatePicker";

export default function Home() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2><span>Dados gerais</span></h2>
        <MyDatePicker />
        {/* <Input title="Data do atendimento" type="date" hint="20/01/2023" name="data" /> */}
        <Input title="Horário" type="time" hint="11:00" name="horario" />
        <Input title="Recepcionista" type="text" hint="VC Charles" name="recepcionista" />
        <Input title="Oficial" type="text" hint="1º TEN LEONARDO" name="oficial" />
        <Input title="Acesso ao atendimento" type="text" hint="Retorno" name="acesso" />
        <Input title="Local do atendimento" type="text" hint="CIAP/SEDE" name="local" />
        <div className={styles.buttonsBox}>
          <Button name="Próxima" />
          <Button name="Cancelar" />
        </div>
      </div>
    </>
  )
}
