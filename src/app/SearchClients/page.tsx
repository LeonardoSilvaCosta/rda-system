'use client';
import React, { useEffect, useState } from 'react';
import { BiUserX } from 'react-icons/bi';

import styles from './styles.module.scss';

import { ClientCard } from '@/components/ClientCard';
import { Header } from '@/components/Header';
import { LoadingComponent } from '@/components/Loading/loading';
import { PaginationComponent } from '@/components/PaginationComponent';
import { SearchBar } from '@/components/SearchBar';
import { Sidebar } from '@/components/Sidebar';
import { useGlobalContext } from '@/context/globalContext';
import { GenericPerson } from '@/types/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function SearchClients() {
  const [isLoading, setIsLoading] = useState(true);
  const [attendeds, setAttendeds] = useState<GenericPerson[]>([
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
  const [filteredData, setFilteredData] = useState<GenericPerson[]>(attendeds);
  const [page, setPage] = useState(1);
  const [totalCountOfRegisters, setTotalCountOfRegisters] = useState(0);
  const { showNav, setShowNav } = useGlobalContext();

  const [query, setQuery] = useState('');

  useEffect(() => {
    async function getCount() {
      const supabase = createClientComponentClient();
      const { count } = await supabase
        .from('tb_attendeds')
        .select('*', { count: 'exact', head: true });
      setTotalCountOfRegisters(Number(count));
    }

    getCount();
  }, []);

  useEffect(() => {
    async function getAttedends() {
      const data = await fetch(`/api/get_attendeds?page=${page}`);
      const attendeds = await data.json();
      setAttendeds(attendeds);

      setIsLoading(false);
    }

    getAttedends();
  }, [page]);

  useEffect(() => {
    setFilteredData(attendeds);
  }, [attendeds]);

  useEffect(() => {
    if (query === '') setFilteredData(attendeds);
  }, [query, attendeds]);

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
    <main className={`${styles.wrapper} ${showNav ? styles.noScroll : ''}`}>
      <Sidebar />
      <div className={styles.main}>
        <Header title={isLoading ? 'Carregando...' : ''} />
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <div className={styles.container}>
            <div
              className={`${styles.overlay} ${showNav ? styles.active : ''}`}
              onClick={() => setShowNav(!showNav)}
            ></div>
            <div>
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
                    <React.Fragment key={e.id}>
                      <ClientCard
                        avatar={'/default-user.svg'}
                        fullname={e.fullname}
                        rank={e.rank}
                        cadre={e.cadre}
                        rg={e.rg}
                        nickname={e.nickname}
                        cpf={e.cpf}
                      />
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <div className={styles.noContent}>
                  <BiUserX className={styles.emptyPaperIcon} />
                  <p>{`Nenhum atendido encontrado.`}</p>
                </div>
              )}
            </div>
            <PaginationComponent
              totalCountOfRegisters={totalCountOfRegisters}
              currentPage={page}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </main>
  );
}
