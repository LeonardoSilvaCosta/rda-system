"use client"
import { Header } from "@/components/Header";

import styles from './styles.module.scss';

import { MyForm } from "@/components/MyForm";

export default function Home() {

  return (
    <>
      <Header />
      <div className={styles.container}>
        <MyForm />
      </div>
    </>
  )
}
