import { useContext, useEffect, useState } from "react";
import search from "../../assets/search.svg";
import SelectProduct from "../../components/input/select";
import Seller from "../../components/products";
import { toastFail } from "../../context/toast";
import { formatValue, sortById } from "../../functions/functions";
import ModalProdutos from "../../components/modalProduto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../../context/context";

export default function Store({ setShowModal }) {
  const { infoDb } = useContext(AppContext);
  const [productsFilter, setProductsFilter] = useState(infoDb.produtos);
  const [modalProduto, setModalProduto] = useState("");
  const [selectInput, setSelectInput] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  console.log({ infoDb });

  async function handleAddProduct(e, product) {
    e.preventDefault();
    e.stopPropagation();
    let cartProducts = [];
    if (localStorage.getItem("cart")) {
      cartProducts = JSON.parse(localStorage.getItem("cart"));
      const isProductInCart = cartProducts.some(
        (cartProduct) => cartProduct.product.id === product.id
      );
      if (isProductInCart) {
        return toastFail("Este produto ja esta no seu carrinho");
      }
    }
    const produto = {
      product: {
        id: product.id,
        categoria: product.categoryId,
        nome: product.name,
        peso: product.weight,
        preco: product.promotion ? product.promotionPrice : product.price,
        url: product.image,
      },
      quantidade: 0,
    };
    cartProducts.push(produto);
    await AsyncStorage.setItem("cart", JSON.stringify(cartProducts));
    setShowModal(true);
    setModalProduto("");
  }

  function searchProduct(searchTerm) {
    if (searchTerm) {
      const searchProduct = infoDb.produtos.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setProductsFilter(searchProduct);
    } else {
      setProductsFilter(infoDb.produtos);
    }
  }

  useEffect(() => {
    setProductsFilter(infoDb.produtos);
  }, [infoDb.produtos]);

  return (
    <main className="flex justify-center w-full">
      <div className="sidebar"></div>
      <div className="flex flex-col justify-evenly items-center first-letter:main w-full h-full py-20 pl-40 pr-20 gap-8 md:p-2">
        <div className="flex justify-evenly items-center w-full h-full">
          <div className="relative flex items-center justify-center w-1/2 bg-[#f3f3f3] gap-[5%] p-3 rounded-l-2xl md:hidden">
            <SelectProduct
              className="!w-1/5 !bg-transparent !border-none"
              setSelectInput={setSelectInput}
              selectInput={selectInput}
              categories={infoDb.categories}
            />
            <h2>|</h2>
            <input
              className="bg-transparent border-none w-9/12 h-full outline-none font-main text-sm font-medium"
              type="search"
              name="search"
              id="search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                searchProduct(e.target.value);
              }}
            />
            <img
              src={search}
              alt="icon search"
              className="absolute right-0 h-full rounded-r-2xl rounded-bl-2xl bg-green p-2"
            />
          </div>
          <div className="cursor-pointer bg-[#f3f3f3] w-44 h-12 rounded-2xl flex justify-center items-center border-solid border-2 border-grey transition-all duration-500  text-green hover:border-green hover:bg-green hover:text-[#f3f3f3] md:hidden">
            <h2 className=" flex justify-center items-center font-main text-sm font-black w-72 h-fit after:content-['x'] after:ml-4">
              Limpar filtro
            </h2>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center w-full h-full gap-20 md:gap-2">
          {productsFilter.length
            ? productsFilter.map((product) => {
                return (
                  <div
                    className="cursor-pointer h-full"
                    onClick={(e) => {
                      setModalProduto(product);
                    }}
                    key={product.id}
                  >
                    <Seller
                      onClick={(e) => handleAddProduct(e, product)}
                      img={product.image}
                      name={product.name}
                      priceFull={formatValue(product.price / 100)}
                      stock={product.stock}
                    />
                  </div>
                );
              })
            : ""}
        </div>
      </div>
      {modalProduto && (
        <ModalProdutos
          produto={modalProduto}
          setModalProduto={setModalProduto}
          handleAddProduct={handleAddProduct}
        />
      )}
    </main>
  );
}
