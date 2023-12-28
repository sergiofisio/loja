import { useEffect, useState } from "react";
import axios from "../../Service/api";
import search from "../../assets/search.svg";
import SelectProduct from "../../components/input/select";
import Seller from "../../components/products";
import { toastFail } from "../../context/toast";
import { formatValue, sortById } from "../../functions/functions";
import ModalProdutos from "../../components/modalProduto";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Store({ setShowModal }) {
  const [products, setProducts] = useState([]);
  const [modalProduto, setModalProduto] = useState("");
  const [selectInput, setSelectInput] = useState("Todos");

  function handleAddProduct(e, product) {
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
    console.log(product);
    cartProducts.push(produto);
    localStorage.setItem("cart", JSON.stringify(cartProducts));
    setShowModal(true);
  }

  async function getAllProducts() {
    try {
      const {
        data: { products },
      } = await axios.get("/infoHome/false", {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      });
      console.log(products);
      setProducts(sortById(products));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (products.length < 1) {
      getAllProducts();
    }
  }, []);

  return (
    <main className="flex justify-center w-full">
      <div className="sidebar"></div>
      <div className="flex flex-col justify-evenly items-center first-letter:main w-full h-full py-20 pl-40 pr-20 gap-8">
        <div className="flex justify-evenly items-center w-full h-full">
          <div className="relative flex items-center justify-center w-1/2 bg-[#f3f3f3] gap-[5%] p-3 rounded-l-2xl">
            <SelectProduct
              className="!w-1/5 !bg-transparent !border-none"
              setSelectInput={setSelectInput}
              selectInput={selectInput}
            />
            <h2>|</h2>
            <input
              className="bg-transparent border-none w-9/12 h-full outline-none font-main text-sm font-medium"
              type="search"
              name=""
              id=""
            />
            <img
              src={search}
              alt="icon search"
              className="absolute right-0 h-full rounded-r-2xl rounded-bl-2xl bg-green p-2"
            />
          </div>
          <div className="cursor-pointer bg-[#f3f3f3] w-44 h-12 rounded-2xl flex justify-center items-center border-solid border-2 border-grey transition-all duration-500  text-green hover:border-green hover:bg-green hover:text-[#f3f3f3]">
            <h2 className=" flex justify-center items-center font-main text-sm font-black w-72 h-fit after:content-['x'] after:ml-4">
              Limpar filtro
            </h2>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center w-full h-full gap-20">
          {products.length
            ? products.map((product) => {
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
