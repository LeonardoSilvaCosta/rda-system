'use client';
import { useEffect, useState } from 'react';
import { BiUserX } from 'react-icons/bi';

import styles from './styles.module.scss';

import { ClientCard } from '@/components/ClientCard';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { Sidebar } from '@/components/Sidebar';
import { GenericAttended } from '@/types/types';
export default function SearchClients() {
  const [attendeds, setAttendeds] = useState<GenericAttended[]>([
    {
      id: '',
      avatar: '',
      fullname: '',
      rank: '',
      cadre: '',
      rg: '',
      nickname: '',
      cpf: ''
    }
  ]);
  const [cardSelectedId, setCardSelectedId] = useState('');
  const [filteredData, setFilteredData] =
    useState<GenericAttended[]>(attendeds);

  const [query, setQuery] = useState('');

  useEffect(() => {
    async function getAttedends() {
      const data = await fetch('/api/get_attendeds');
      const attendeds = await data.json();
      setAttendeds(attendeds);
    }

    getAttedends();
  }, []);

  useEffect(() => {
    setFilteredData(attendeds);
  }, [attendeds]);

  useEffect(() => {
    if (query === '') setFilteredData(attendeds);
  }, [query, attendeds]);

  const handleClick = (selectedCardId: string) => {
    setCardSelectedId(selectedCardId);
    setCurrentScreen(2);
  };

  const handleChangeInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    const qToLower = q.toLowerCase();
    setQuery(q);

    if (q !== '') {
      const res = await fetch(`/api/get_attendeds?q=${qToLower}`);
      const data = await res.json();
      if (!data) return;

      setFilteredData(data);
    }
  };
  return (
    <main className={styles.wrapper}>
      <Sidebar />
      <div className={styles.main}>
        <Header title="Home" />
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.searchBox}>
              <SearchBar
                list={attendeds}
                search={query}
                setSearch={setQuery}
                handleChangeInput={handleChangeInput}
              />
            </div>
            {filteredData.length > 0 ? (
              <div className={styles.cards}>
                {filteredData.map((e) => (
                  <>
                    <ClientCard
                      key={e.id}
                      avatar={'/default-user.svg'}
                      fullname={e.fullname}
                      rank={e.rank}
                      cadre={e.cadre}
                      rg={e.rg}
                      nickname={e.nickname}
                      cpf={e.cpf}
                    />
                  </>
                ))}
              </div>
            ) : (
              <div className={styles.noContent}>
                <BiUserX className={styles.emptyPaperIcon} />
                <p>{`Nenhum atendido encontrado para esta busca.`}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
