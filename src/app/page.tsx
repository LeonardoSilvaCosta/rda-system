'use client';
import { useEffect, useState } from 'react';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { SlNote } from 'react-icons/sl';

import styles from './styles.module.scss';

import { ClientCard } from '@/components/ClientCard';
import { DashboardButton } from '@/components/DashboardButton';
import { Navbar } from '@/components/Navbar';
import { SearchBar } from '@/components/SearchBar';
import { ClientCardType } from '@/types/types';

export default function Home() {
  const [attendeds, setAttendeds] = useState<ClientCardType[]>([]);
  const [search, setSearch] = useState('');

  const lowerSearch = search.toLocaleLowerCase();

  const filteredList = attendeds.filter((item) =>
    item.fullname.toLocaleLowerCase().includes(lowerSearch)
  );

  useEffect(() => {
    const getAttendeds = async () => {
      try {
        const resAttendeds = await fetch('/api/get_attendeds');
        const attendeds = await resAttendeds.json();

        setAttendeds(attendeds);
      } catch (error) {
        console.log(error);
      }
    };

    getAttendeds();
  }, []);

  return (
    <>
      <Navbar title="Home" />
      <div className={styles.container}>
        <div className={styles.searchbarBox}>
          <SearchBar
            variation={'home'}
            list={attendeds}
            search={search}
            setSearch={setSearch}
          />
        </div>
        {search ? (
          <ul className={styles.clientCardContainer}>
            {filteredList.map((item) => (
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
        ) : (
          <div className={styles.dashboardButtonContainer}>
            <DashboardButton
              icon={AiOutlineUserAdd}
              name={'Cadastrar atendido'}
            />
            <DashboardButton icon={SlNote} name={'Registrar atendimento'} />
          </div>
        )}
      </div>
    </>
  );
}
