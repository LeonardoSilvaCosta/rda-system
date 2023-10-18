'use client';

import { useRouter } from 'next/navigation';
import { useContext, createContext } from 'react';

interface GlobalContextProps {
  returnToDashboard: () => void;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const returnToDashboard = () => {
    router.push('/');
  };

  return (
    <GlobalContext.Provider value={{ returnToDashboard }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error(
      'useGlobalContext deve ser usado dentro de um GlobalContextProvider'
    );
  }
  return context;
};
