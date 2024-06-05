import { ReactNode, useEffect, useState } from "react";
import { createContext } from "react";
import axios from "../Service/api";
import { toastfy } from "./toast";
import { User } from "../interfaces/interface";

interface ContextProps {
  infoDb: any;
  setInfoDb: React.Dispatch<React.SetStateAction<User[]>>;
  isLoading: boolean;
}

interface ProviderProps {
  children: ReactNode;
}

// Fornecer um valor padrão para o contexto
const defaultContext: ContextProps = {
  infoDb: [],
  setInfoDb: () => {},
  isLoading: true,
};

export const AppContext = createContext<ContextProps>(defaultContext);

export const ContextProvider = ({ children }: ProviderProps) => {
  const [infoDb, setInfoDb]: any = useState({
    depoimentos: [],
    parceiros: [],
    produtos: [],
    usuarios: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      setIsLoading(true);
      try {
        const {
          data: { users, products, testimonials, partners },
        } = await axios.get("/infoDb/true");

        if (users && users.length > 0) {
          setInfoDb({
            depoimentos: testimonials,
            parceiros: partners,
            produtos: products,
            usuarios: users,
          });
          setIsLoading(false);
        } else {
          setTimeout(getUsers, 3000);
        }
      } catch (error: any) {
        if (error.code === "ECONNABORTED") {
          setTimeout(getUsers, 3000);
        } else {
          toastfy(
            "error",
            "Ocorreu um erro, por favor entre com contato com o suporte da Green Life",
            "text-red",
            3000
          );
          setIsLoading(false);
        }
      }
    };
    getUsers();
  }, []);

  return (
    <AppContext.Provider value={{ infoDb, setInfoDb, isLoading }}>
      {children}
    </AppContext.Provider>
  );
};
