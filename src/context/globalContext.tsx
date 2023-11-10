'use client';

import { useRouter } from 'next/navigation';
import {
  useContext,
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect
} from 'react';

import { GenericPerson } from '@/types/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface GlobalContextProps {
  currentUser: GenericPerson;
  isLoading: boolean;
  returnToDashboard: () => void;
  showNav: boolean;
  setShowNav: Dispatch<SetStateAction<boolean>>;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [showNav, setShowNav] = useState(false);
  const returnToDashboard = () => {
    router.push('/');
  };

  const supabase = createClientComponentClient();
  const [currentUser, setCurrentUser] = useState<GenericPerson>({
    id: '',
    avatar: '',
    fullname: '',
    nickname: '',
    rg: '',
    rank: '',
    cadre: '',
    cpf: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getCurrentUser() {
      const { data: logedUserData } = await supabase.auth.getUser();
      const userEmail = logedUserData.user?.email;
      const data = await fetch(`/api/get_current_user?email=${userEmail}`);
      const userData = await data.json();

      setCurrentUser(userData);
      setIsLoading(false);
    }

    getCurrentUser();
  }, []);

  return (
    <GlobalContext.Provider
      value={{ currentUser, isLoading, returnToDashboard, showNav, setShowNav }}
    >
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
