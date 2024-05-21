import { ReactNode, useEffect, useState } from "react";
import { createContext } from "react";
import axios from "../Service/api";
import { toastfy } from "./toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../interfaces/interface";

interface ContextProps {
  usersInfo: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  isLoading: boolean;
}

interface ProviderProps {
  children: ReactNode;
}

export const AppContext = createContext<ContextProps | null>(null);

export const ContextProvider = ({ children }: ProviderProps) => {
  const [usersInfo, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      setIsLoading(true);
      try {
        const {
          data: { users },
        } = await axios.get("/allUsersInfo", {
          headers: {
            authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
          },
        });

        console.log({ users });

        if (users && users.length > 0) {
          setUsers(users);
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
    <AppContext.Provider value={{ usersInfo, setUsers, isLoading }}>
      {children}
    </AppContext.Provider>
  );
};
