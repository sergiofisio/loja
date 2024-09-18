import { toastfy } from "./toast";
import { useState, useEffect, createContext } from "react";
import axios from "../Service/api";

export const AppContext = createContext();

export const ContextProvider = ({ children }) => {
  const [infoDb, setInfoDb] = useState({
    depoimentos: [],
    historicos: [],
    parceiros: [],
    produtos: [],
    isLoading: true,
    retryCount: 0,
    categories: [],
  });

  useEffect(() => {
    const getProducts = async () => {
      setInfoDb({ ...infoDb, isLoading: true });
      try {
        const {
          data: { products, testimonials, partners, categories },
        } = await axios.get("/infoHome/false");
        if (products && products.length > 0) {
          setInfoDb({
            ...infoDb,
            depoimentos: testimonials,
            historicos: [],
            parceiros: partners,
            produtos: products,
            categories,
            isLoading: false,
          });
        } else if (infoDb.retryCount < 5) {
          setTimeout(getProducts, 3000);
          setInfoDb({ ...infoDb, retryCount: retryCount + 1 });
        }
      } catch (error) {
        if (error.code === "ECONNABORTED" && infoDb.retryCount < 5) {
          setTimeout(getProducts, 3000);
          setRetryCount(infoDb.retryCount + 1);
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
    getProducts();
  }, [infoDb.retryCount]);

  return (
    <AppContext.Provider value={{ infoDb, setInfoDb }}>
      {children}
    </AppContext.Provider>
  );
};
