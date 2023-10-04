"use client"
import { Header } from "@/components/Header";

import styles from './styles.module.scss';

import { DashboardButton } from "@/components/DashboardButton";
import { AiOutlineUserAdd } from 'react-icons/ai';
import { SlNote } from 'react-icons/sl';
import { SearchBar } from "@/components/SearchBar";
import { useEffect, useState } from "react";
import { ClientCard } from "@/components/ClientCard";
import { ClientCardType } from "@/types/types";

export default function Home() {
  const [attendeds, setAttendeds] = useState<ClientCardType[]>([]);
  const [search, setSearch] = useState('');

  const lowerSearch = search.toLocaleLowerCase();

  const filteredList = attendeds.filter((item) =>
    item.fullname
      .toLocaleLowerCase()
      .includes(lowerSearch));

  useEffect(() => {
    const getAttendeds = async () => {
      try {
        const resAttendeds = await fetch('/api/get_attendeds');
        const attendeds = await resAttendeds.json();

        const formattedData = attendeds.map((e: any) => {
          return {
            id: e.id,
            fullname: e.fullname,
            nickname: e.nickname,
            rg: e.rg,
            cpf: e.cpf,
            rank: e.tb_ranks ? e.tb_ranks.name : null,
            cadre: e.tb_cadres ? e.tb_cadres.name : null,
          };
        });

        setAttendeds(formattedData);

      } catch (error) {
        console.log(error)
      }
    }

    getAttendeds();
  }, [])

  console.log(attendeds)

  return (
    <>
      <Header title="Home" />
      <div className={styles.container}>
        <div className={styles.searchbarBox}>
          <SearchBar variation={"home"} list={attendeds} search={search} setSearch={setSearch} />
        </div>
        {search ? (
          <ul>
            {filteredList.map(item => (
              <ClientCard
                key={item.cpf}
                fullname={item.fullname}
                rank={item.rank}
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
