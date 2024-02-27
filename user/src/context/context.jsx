import { useEffect, useState } from "react";
import { createContext } from "react";
import axios from "../Service/api";
import { toastfy } from "../context/toast";

export const AppContext = createContext();

export const ContextProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getProducts() {
            setIsLoading(true);
            try {
                const {
                    data: { allProducts },
                } = await axios.get("/products");
                setProducts(allProducts);
                setIsLoading(false);
            } catch (error) {
                toastfy(
                    "error",
                    "Ocorreu um erro, por favor entre com contato com o suporte da Bertha Home",
                    "text-red",
                    3000,
                );
                setIsLoading(false);
            }
        }
        getProducts();
    }, []);

    return (
        <AppContext.Provider value={{ products, setProducts, isLoading }}>
            {children}
        </AppContext.Provider>
    );
};
