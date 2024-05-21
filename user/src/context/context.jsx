export const ContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        } else {
          setTimeout(getProducts, 3000);
        }
      } catch (error) {
        if (error.code === "ECONNABORTED") {
          setTimeout(getProducts, 3000);
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
  }, []);

  return (
    <AppContext.Provider value={{ products, setProducts, isLoading }}>
      {children}
    </AppContext.Provider>
  );
};
