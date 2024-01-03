import { useEffect, useState } from "react";
import closeBtn from "../../assets/closeBtn.svg";
import axiosPrivate from "../../Service/api";
import { localconfig } from "../../utils/localConfig";
import { formatValue } from "../../functions/functions";

export default function ModalOrder({ setShowModalOrder, order }) {
  const [allProducts, setAllProducts] = useState([]);

  console.log(order);
  async function getAllProducts() {
    try {
      const {
        data: { allProducts },
      } = await axiosPrivate.get(`/products`);
      setAllProducts(allProducts);
    } catch (error) {
      console.log(error);
    }
  }

  function getProduct(id) {
    console.log(id);
    const product = allProducts.find((product) => product.id === id);
    console.log(product);
    return product;
  }

  function sumValues(products) {
    let total = 0;
    products.forEach((item) => {
      total += item.quantity * item.amount;
    });
    return total;
  }

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div className="flex flex-col items-center bg-bgModal absolute top-0 w-full h-full z-30 p-5">
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
          Código do pedido: <span className="font-bold">{order.idPagarme}</span>
        </h2>
        <div className="flex w-full h-full py-8 px-4 gap-10">
          <div className="flex flex-col justify-center gap-8">
            <div className="flex flex-col items-start gap-3 justify-center w-60 bg-green border-green border-solid rounded-b-xl rounded-r-xl border-4 p-1">
              <h2 className="font-main text-sm underline text-white font-bold uppercase">
                Endereço de entrega
              </h2>
              <div className="font-main text-white text-sm font-medium">
                <h2>{order.adress.line_1}</h2>
                {order.adress.line_2 && <h2>order.adress.line_2</h2>}
                <h2>{order.adress.zip_code}</h2>
                <h2>
                  {order.adress.city}/{order.adress.state}
                </h2>
                <h2></h2>
              </div>
            </div>
            <div>
              <h2 className="flex flex-col">
                Forma de pagamento:{" "}
                <span>
                  {order.transactionType === "credit_card"
                    ? "Cartão de Crédito"
                    : "Pix"}
                </span>
              </h2>
            </div>
            <div>
              <h2 className="flex flex-col">
                Codigo de rastreio:{" "}
                <span>
                  {order.trackingCode
                    ? order.trackingCode
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
                  {JSON.parse(order.products).map((item, key) => {
                    return (
                      console.log(item),
                      (
                        <td key={key}>
                          <td className="flex w-full border-green-200 border-b-2">
                            <td className=" w-2/3 flex items-center">
                              {allProducts.length && (
                                <img
                                  className="max-h-20"
                                  src={getProduct(item.code).image}
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
                      )
                    );
                  })}
                </tbody>
              </table>
              <div className="flex justify-center items-center h-3/6">
                <td className="text-center text-4xl font-bold font-main">
                  {`TOTAL: 
                ${formatValue(sumValues(JSON.parse(order.products)) / 100)}`}
                </td>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
