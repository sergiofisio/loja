import Button from "../button";
import Input from "../input/form/input";
import trash from "../../assets/cart/trash.svg";
import cartImg from "../../assets/cart/cart-green.svg";
import minus from "../../assets/cart/minus.svg";
import plus from "../../assets/cart/plus.svg";
import arrowRight from "../../assets/access/ArrowRight.svg";
import { toastFail } from "../../context/toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";

export default function InfoCart({
  allProducts,
  cart,
  setState,
  cupom,
  handleCupom,
  frete,
  valueCartProducts,
}) {
  const navigate = useNavigate();

  const changeQtd = useCallback(
    async (e, id, operation) => {
      e.stopPropagation();
      let oldCart = [...cart];

      const itemIndex = oldCart.findIndex((item) => item.product.id === id);
      const product = allProducts.find((product) => product.id === id);
      if (operation === "sum") {
        if (oldCart[itemIndex].quantidade + 1 > product.stock)
          return toastFail("Quantidade indisponível");
        oldCart[itemIndex].quantidade += 1;
      }
      if (operation === "minus" && oldCart[itemIndex].quantidade > 1) {
        oldCart[itemIndex].quantidade -= 1;
      }
      if (operation === "delete") {
        oldCart.splice(itemIndex, 1);
        if (!oldCart.length) {
          await AsyncStorage.setItem("cart", JSON.stringify(oldCart));
          setState((prevState) => ({ ...prevState, cart: oldCart }));
          setTimeout(() => navigate("/store"), 500);
        }
      }
      await AsyncStorage.setItem("cart", JSON.stringify(oldCart));
      if (
        operation === "delete" ||
        operation === "sum" ||
        operation === "minus"
      ) {
        setState((prevState) => ({ ...prevState, cart: oldCart }));
      }
    },
    [cart, allProducts, navigate, setState]
  );

  function sumValueFrete(value, frete) {
    return frete + value;
  }

  return (
    <div className="flex flex-col w-1/3 min-h-full gap-2 m-4 md:w-full md:m-0">
      <div className="flex justify-between px-4 md:flex-col">
        <div
          onClick={() => {
            navigate("/store");
          }}
          className="flex items-center gap-4 cursor-pointer"
        >
          <img className="w-8 h-8" src={arrowRight} alt="icon Arrow rigth" />
          <h1 className="font-main text-lg font-semibold">Ir para a loja</h1>
        </div>
        <h1 className="font-main text-5xl text-green font-semibold">
          Carrinho
        </h1>
        <img src={cartImg} alt="img Cart" className="md:hidden" />
      </div>
      <div className="flex flex-col justify-between w-full h-full border-2 border-green rounded-2xl p-2">
        <table className="h-full ">
          <thead className="flex justify-between border-b-2 border-greenScale-200 pr-2 1536:pr-0 1440:pr-0 1366:pr-0">
            <tr className="flex justify-between items-center w-full md:text-sm">
              <th className="w-full border-gray-200 border-r-2">Produto</th>
              <th className="w-1/2 border-gray-200 border-r-2">Valor</th>
              <th className="w-1/3">Qde</th>
              <th className="w-1/5 opacity-0">Excluir</th>
            </tr>
          </thead>
          <tbody className="flex flex-col max-h-[40rem] 1536:max-h-[20rem] 1440:max-h-[30rem] 1366:max-h-[22rem] overflow-y-scroll scrollbar-thin scrollbar-thumb-green ">
            {cart.map(({ product, quantidade }) => {
              return (
                <tr
                  className="flex justify-center border-grey border-opacity-40 border-b-2 py-2 w-full font-main text-base md:text-sm"
                  key={product.id}
                >
                  <td className="flex items-center gap-8 border-grey border-opacity-40 border-r-2 w-full font-medium ">
                    <img
                      className="w-16 1536:w-14 md:hidden"
                      src={product.url}
                      alt=""
                    />
                    {product.nome}
                  </td>
                  <td className="flex justify-center items-center font-semibold w-1/2 border-grey border-opacity-40 border-r-2">
                    {((product.preco / 100) * quantidade).toLocaleString(
                      "pt-br",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    )}
                  </td>
                  <td className="flex justify-center items-center w-1/3 gap-2 font-semibold">
                    <img
                      onClick={(e) => changeQtd(e, product.id, "minus")}
                      className="w-5 cursor-pointer"
                      src={minus}
                      alt="minus"
                    />
                    {quantidade}
                    <img
                      onClick={(e) => changeQtd(e, product.id, "sum")}
                      className="w-5 cursor-pointer"
                      src={plus}
                      alt="plus"
                    />
                  </td>
                  <td className="flex justify-center items-center  w-1/5">
                    <img
                      onClick={(e) => changeQtd(e, product.id, "delete")}
                      className="cursor-pointer w-5"
                      src={trash}
                      alt="icon deletar"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <table>
          <tbody className="flex flex-col justify-end min-h-[22%] md:text-sm">
            <tr className="flex justify-center border-b-2 border-greenScale-200">
              <th className="">TOTAL</th>
            </tr>
            <tr className="flex justify-between items-center w-full border-grey  border-b-2">
              <th className="w-1/5 border-gray-200 border-r-2">Envio</th>
              <th className="w-1/5  border-gray-200 border-r-2">Frete</th>
              <th className="w-1/5  border-gray-200 border-r-2">Produtos</th>
              <th className="w-1/5  border-gray-200 border-r-2">
                Data estimada de entrega
              </th>
              <th className="w-1/5">Total</th>
            </tr>
            <tr className="flex flex-col items-end  font-main text-base">
              <th className="flex justify-end w-full border-gray-400 border-b-2 border-dashed md:text-xs">
                <h2 className="w-1/5 border-gray-200 border-r-2 font-normal">
                  Sedex
                </h2>
                <h2 className="w-1/5  border-gray-200 border-r-2 font-normal">
                  {frete.sedex
                    ? `${Number(frete.sedex.price).toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}`
                    : ""}
                </h2>
                <h2 className="w-1/5  border-gray-200 border-r-2 font-normal">
                  {valueCartProducts.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </h2>
                <h2 className="w-1/5  border-gray-200 border-r-2 font-normal">
                  {frete.sedex ? frete.sedex.date : ""}
                </h2>
                <h2 className="w-1/5 font-normal">
                  {frete.sedex
                    ? `${sumValueFrete(
                        valueCartProducts,
                        frete.sedex.price
                      ).toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}`
                    : ""}
                </h2>
              </th>
              <th className="flex justify-end w-full md:text-xs">
                <h2 className="w-1/5 border-gray-200 border-r-2 font-normal">
                  PAC
                </h2>
                <h2 className="w-1/5  border-gray-200 border-r-2 font-normal">
                  {frete.pac
                    ? `${Number(frete.pac.price).toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}`
                    : ""}
                </h2>
                <h2 className="w-1/5  border-gray-200 border-r-2 font-normal">
                  {valueCartProducts.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </h2>
                <h2 className="w-1/5  border-gray-200 border-r-2 font-normal">
                  {frete.pac ? frete.pac.date : ""}
                </h2>
                <h2 className="w-1/5 font-normal">
                  {frete.pac
                    ? `${sumValueFrete(
                        valueCartProducts,
                        frete.pac.price
                      ).toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}`
                    : ""}
                </h2>
              </th>
            </tr>
          </tbody>
        </table>
        <div className="flex items-end justify-center gap-4">
          <Input
            className="w-1/2 !font-bold md:text-xs"
            label="Cupom"
            set={(e) =>
              setState((prevState) => ({ ...prevState, cupom: e.target.value }))
            }
            value={cupom}
          />
          <Button
            className="!w-20 h-12 rounded-3xl bg-green md:text-xs"
            type="button"
            text="Aplicar"
            onClick={handleCupom}
          />
        </div>
      </div>
    </div>
  );
}
