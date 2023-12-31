import { useEffect, useState } from "react";
import closeBtn from "../../assets/closeBtn.svg";
import axiosPrivate from "../../Service/api";
import { localconfig } from "../../utils/localConfig";

export default function ModalOrder({ setShowModalOrder, order }) {
  const [allProducts, setAllProducts] = useState([]);
  const [orderDb, setOrderDb] = useState("");
  async function getAllProducts() {
    try {
      const { data } = await axiosPrivate.get(`/products`);
      setAllProducts(data);
    } catch (error) {
      console.log(error);
    }
  }

  function getProduct(id) {
    const product = allProducts.find((product) => product.id === Number(id));
    return product;
  }

  async function getOrder(id) {
    try {
      const { data } = await axiosPrivate.get(
        `/getOrderDb/${id}`,
        localconfig.getAuth(localStorage.getItem("token"))
      );
      setOrderDb(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllProducts();
    getOrder(order.id);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center bg-bgModal absolute top-0 w-full h-full z-30">
      <div
        className={`relative flex flex-col justify-evenly w-2/3 h-2/3 1536:h-[90%] 1366:h-[90%] bg-white rounded-3xl p-8 shadow-green shadow-2xl`}
      >
        <img
          onClick={() => {
            setShowModalOrder("");
          }}
          className="absolute top-6 right-6 cursor-pointer"
          src={closeBtn}
          alt="btnClose"
        />
        <h2 className="text-center font-main text-2xl">
          Código do pedido: <span className="font-bold">{order.id}</span>
        </h2>
        <div className="flex w-full h-full py-8 px-4 gap-10">
          <div className="flex flex-col justify-center gap-8">
            <div className="flex flex-col items-start gap-3 justify-center w-60 bg-green border-green border-solid rounded-b-xl rounded-r-xl border-4 cursor-pointer p-1">
              <h2 className="font-main text-sm underline text-white font-bold uppercase">
                Endereço de entrega
              </h2>
              <div className="font-main text-white text-sm font-medium">
                <h2>{order.shipping.address.line_1}</h2>
                {order.shipping.address.line_2 && (
                  <h2>order.shipping.address.line_2</h2>
                )}
                <h2>{order.shipping.address.zip_code}</h2>
                <h2>
                  {order.shipping.address.city}/{order.shipping.address.state}
                </h2>
                <h2></h2>
              </div>
            </div>
            <div>
              <h2 className="flex flex-col">
                Forma de pagamento:{" "}
                <span>
                  {order.charges[0].payment_method === "credit_card"
                    ? "Cartão de Crédito"
                    : order.charges[0].payment_method}
                </span>
              </h2>
            </div>
            <div>
              <h2 className="flex flex-col">
                Codigo de rastreio:{" "}
                <span>
                  {orderDb.length
                    ? orderDb.rastreio
                    : "Seu pedido ainda não foi enviado"}
                </span>
              </h2>
            </div>
          </div>
          <div className="flex flex-col justify-between w-full h-full">
            <div className="border-green border-2 rounded-xl h-2/3">
              <table className="flex flex-col w-full h-full px-3 py-2 gap-2 ">
                <thead className="flex border-b-2 border-greenScale-600 font-bold uppercase pr-2">
                  <tr className="w-2/3 text-center ">Item</tr>
                  <tr className="w-1/6 text-center border-x-2 border-greenScale-200">
                    Qtde
                  </tr>
                  <tr className="w-1/6 text-center">Total</tr>
                </thead>
                <tbody className="w-full flex flex-col  py-2 overflow-y-scroll max-h-[16rem] scrollbar-thin scrollbar-thumb-green">
                  {order.items.map((item, key) => {
                    return (
                      <td key={key}>
                        <td className="flex w-full border-green-200 border-b-2">
                          <td className=" w-2/3 flex items-center">
                            {allProducts.length && (
                              <img
                                className="w-14"
                                src={getProduct(item.code).url}
                                alt="img produto"
                              />
                            )}
                            <h2 className=" w-full text-center">
                              {item.description}
                            </h2>
                          </td>
                          <td className="w-1/6 border-x-2 border-greenScale-200 flex justify-center items-center">
                            <h2 className="text-center ">{item.quantity}</h2>
                          </td>
                          <td className="w-1/6 flex justify-center items-center">
                            <h2 className=" text-center">
                              {(
                                (item.quantity * item.amount) /
                                100
                              ).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </h2>
                          </td>
                        </td>
                      </td>
                    );
                  })}
                </tbody>
              </table>
              <div className="flex justify-center items-center h-3/6">
                <td className="text-center text-4xl font-bold font-main">
                  {`TOTAL: 
                ${(order.amount / 100).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}`}
                </td>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
