"use client"
import { Header } from "@/components/Header";

import styles from './styles.module.scss';

import { DashboardButton } from "@/components/DashboardButton";
import { AiOutlineUserAdd } from 'react-icons/ai';
import { SlNote } from 'react-icons/sl';
import { SearchBar } from "@/components/SearchBar";
import { listClients } from "@/data";
import { useState } from "react";
import { ClientCard } from "@/components/ClientCard";

export default function Home() {
  const [search, setSearch] = useState('');

  const lowerSearch = search.toLocaleLowerCase();

  const filteredList = listClients.filter((item) =>
    item.fullname
      .toLocaleLowerCase()
      .includes(lowerSearch));

  return (
    <>

      <Header title="Home" />
      <div className={styles.container}>
        <div className={styles.searchbarBox}>
          <SearchBar variation={"home"} list={listClients} search={search} setSearch={setSearch} />
        </div>
        {search ? (
          <ul>
            {filteredList.map(item => (
              <ClientCard
                key={item.cpf}
                fullname={item.fullname}
                posto_grad={item.posto_grad}
                cadre={item.cadre}
                rg={item.rg}
                nickname={item.nickname}
                cpf={item.cpf}
              />
            ))}
          </ul>
        ) :
          <div className={styles.dashboardButtonContainer}>
            <DashboardButton icon={AiOutlineUserAdd} name={"Cadastrar atendido"} />
            <DashboardButton icon={SlNote} name={"Registrar atendimento"} />
          </div>
        }
      </div>
    </>
  )
}
