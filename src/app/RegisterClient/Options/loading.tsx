'use client';
import { Header } from '@/components/Header';
import { LoadingComponent } from '@/components/Loading/loading';

export default function Loading() {
  return (
    <>
      <Header title="Carregando..." />
      <LoadingComponent />;
    </>
  );
}
