'use client';

import { useContext, createContext } from 'react';

interface GlobalContextProps {}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return <GlobalContext.Provider value={{}}>{children}</GlobalContext.Provider>;
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
