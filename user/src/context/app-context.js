import { createContext } from 'react';
import  useAppProvider  from '../hooks/app-provider';

export const AppContext = createContext({});

export function AppListProvider({ children }) {
  const valuesProvider = useAppProvider();
  return (
    <AppContext.Provider value={valuesProvider}>
      {children}
    </AppContext.Provider>
  );
}

