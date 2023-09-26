"use client"
import { Header } from "@/components/Header";

import styles from './styles.module.scss';

import { DashboardButton } from "@/components/DashboardButton";
import { AiOutlineUserAdd } from 'react-icons/ai';
import { SlNote } from 'react-icons/sl';

export default function Home() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.dashboardButtonContainer}>
          <DashboardButton icon={AiOutlineUserAdd} name={"Cadastrar atendido"} />
          <DashboardButton icon={SlNote} name={"Registrar atendimento"} />
        </div>
      </div>
    </>
  )
}
