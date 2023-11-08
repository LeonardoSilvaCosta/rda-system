'use client';
import { AiOutlineCheck } from 'react-icons/ai';

import styles from './styles.module.scss';

import { ClientCard } from '@/components/ClientCard';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { useGlobalContext } from '@/context/globalContext';

const emphasisBoxData = [
  {
    icon: <AiOutlineCheck className={styles.icon} />,
    description: 'Atendimentos no mês',
    number: 100
  },
  {
    icon: <AiOutlineCheck className={styles.icon} />,
    description: 'Atendidos no mês',
    number: 20
  },
  {
    icon: <AiOutlineCheck className={styles.icon} />,
    description: 'Palestras ministradas',
    number: 'Em breve'
  }
];

const frequentDemandsData = [
  {
    name: 'Ansiedade',
    rank: 1
  },
  {
    name: 'Depressão',
    rank: 2
  },
  {
    name: 'Luto',
    rank: 3
  }
];

const recentAppoitments = [
  {
    avatar: '/profile.png',
    cadre: 'QCOPM',
    rank: '1º TEN',
    cpf: '982.645.672-15',
    fullname: 'Leonardo da Silva Costa',
    nickname: 'Leonardo',
    rg: '40897'
  },
  {
    avatar: '/profile.png',
    cadre: 'QCOPM',
    rank: '1º TEN',
    cpf: '982.645.672-15',
    fullname: 'Leonardo da Silva Costa',
    nickname: 'Leonardo',
    rg: '40897'
  },
  {
    avatar: '/profile.png',
    cadre: 'QCOPM',
    rank: '1º TEN',
    cpf: '982.645.672-15',
    fullname: 'Leonardo da Silva Costa',
    nickname: 'Leonardo',
    rg: '40897'
  }
];

export default function Home() {
  const { showNav, setShowNav } = useGlobalContext();
  return (
    <main className={`${styles.wrapper} ${showNav ? styles.noScroll : ''}`}>
      <Sidebar />
      <div className={styles.main}>
        <Header title="Home" />
        <div className={styles.container}>
          <div
            className={`${styles.overlay} ${showNav ? styles.active : ''}`}
            onClick={() => setShowNav(!showNav)}
          ></div>
          <div className={styles.firstRow}>
            <div className={styles.emphasisBoxes}>
              {emphasisBoxData.map((e) => (
                <div key={e.description} className={styles.emphasisBox}>
                  <div className={styles.iconBox}>
                    <AiOutlineCheck className={styles.icon} />
                  </div>
                  <span>{e.description}</span>
                  <h2>{e.number}</h2>
                </div>
              ))}
            </div>
            <div className={styles.frequentDemands}>
              <span className={styles.header}>Demandas frequentes</span>
              <ul>
                {frequentDemandsData.map((e) => (
                  <li key={e.name}>
                    <span>{e.rank}</span>
                    <span>{e.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={styles.secondRow}>
            <div className={styles.recentsAppointments}>
              <span>Atendimentos recentes</span>
              {recentAppoitments.map((e) => (
                <ClientCard
                  key={e.cpf}
                  avatar={e.avatar}
                  cadre={e.cadre}
                  rank={e.rank}
                  cpf={e.cpf}
                  fullname={e.fullname}
                  nickname={e.nickname}
                  rg={e.rg}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
