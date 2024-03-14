import { useEffect, useState } from "react";
import { createContext } from "react";
import axios from "../Service/api";
import { toastfy } from "./toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AppContext = createContext<any>(null);

export const ContextProvider = ({ children }: any) => {
  const [usersInfo, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUsers() {
      setIsLoading(true);
      try {
        const {
          data: { users },
        } = await axios.get("/allUsersInfo", {
          headers: {
            authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
          },
        });

        setUsers(users);
        setIsLoading(false);
      } catch (error) {
        toastfy(
          "error",
          "Ocorreu um erro, por favor entre com contato com o suporte da Green Life",
          "text-red",
          3000
        );
        setIsLoading(false);
      }
    }
    getUsers();
  }, []);

  return (
    <AppContext.Provider value={{ usersInfo, setUsers, isLoading }}>
      {children}
    </AppContext.Provider>
  );
};
