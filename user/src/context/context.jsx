import { toastfy } from "./toast";
import { useState, useEffect, createContext } from "react";
import axios from "../Service/api";

export const AppContext = createContext();

export const ContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      try {
        const {
          data: { allProducts },
        } = await axios.get("/products");
        if (allProducts && allProducts.length > 0) {
          setProducts(allProducts);
          setIsLoading(false);
        } else if (retryCount < 5) {
          setTimeout(getProducts, 3000);
          setRetryCount(retryCount + 1);
        }
      } catch (error) {
        if (error.code === "ECONNABORTED" && retryCount < 5) {
          setTimeout(getProducts, 3000);
          setRetryCount(retryCount + 1);
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
  }, [retryCount]);

  return (
    <AppContext.Provider value={{ products, setProducts, isLoading }}>
      {children}
    </AppContext.Provider>
  );
};
