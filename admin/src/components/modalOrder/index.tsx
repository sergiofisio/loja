import closeBtn from "../../assets/closeBtn.svg";
import { formatValue } from "../../functions/functions";
import Button from "../button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../Service/api";
import { toastFail } from "../../context/toast";

export default function ModalOrder({
  user,
  products,
  setShowOrderInfo,
  order,
}: {
  user: any;
  products: any;
  setShowOrderInfo: any;
  order: any;
}) {
  function getProduct(id: string) {
    const product = products.find((product: any) => product.id === id);
    return product;
  }

  function sumWeight(products: any) {
    let total = 0;
    JSON.parse(products).forEach((item: any) => {
      console.log({ item });

      total += item.quantity * getProduct(item.code).weight;
    });
    console.log(total);

    return total;
  }

  function sum(products: any) {
    let total = 0;
    JSON.parse(products).forEach((item: any) => {
      total += item.quantity * item.amount;
    });
    return total;
  }

  async function generateLabel(e: any) {
    e.preventDefault();
    e.stopPropagation();
    if (!order.finished) return toastFail("O pedido ainda não foi finalizado");
    const response = await axios.post(
      "/ticket",
      {
        id: order.id,
        name: user.name,
        phone: `+${user.phones.mobile_phone.country_code} ${
          user.phones.mobile_phone.area_code
        } ${user.phones.mobile_phone.number.slice(
          0,
          5
        )}-${user.phones.mobile_phone.number.slice(5)}`,
        email: user.email,
        document: user.document,
        address: user.address.line_1.split(", ")[1],
        number: user.address.line_1.split(", ")[0],
        complement: user.address.line_2,
        district: user.address.line_1.split(", ")[2],
        city: user.address.city,
        country: user.address.country,
        zip_code: user.address.zip_code,
        state: user.address.state,
        insurance_value: sum(order.products) / 100,
        products: JSON.parse(order.products),
        weight: sumWeight(order.products) / 1000,
        service: order.shippingType,
      },
      {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      }
    );
    console.log(response);
  }

  return (
    <div className="flex flex-col justify-center items-center bg-bgModal absolute top-0 w-full h-full">
      <div
        className={`relative flex flex-col justify-evenly w-2/3 h-2/3 1536:h-[90%] 1366:h-[90%] bg-white rounded-3xl p-8 shadow-green shadow-2xl`}
      >
        <img
          onClick={() => {
            setShowOrderInfo("");
          }}
          className="absolute top-6 right-6 cursor-pointer"
          src={closeBtn}
          alt="btnClose"
        />
        <h2 className="text-center font-main text-2xl">
          Código do pedido: <span className="font-bold">{order.idPagarme}</span>
        </h2>
        <div className="flex w-full h-full py-8 px-4 gap-10">
          <div className="flex flex-col justify-between w-full h-full">
            <div className="border-green border-2 rounded-xl h-2/3">
              <table className="flex flex-col w-full h-full px-3 py-2 ">
                <thead className="flex border-b-2 border-greenScale-600 font-bold uppercase pr-2">
                  <tr className="w-2/3 text-center ">
                    <h2>Item</h2>
                  </tr>
                  <tr className="w-1/6 text-center border-x-2 border-greenScale-200">
                    <h2>Qtde</h2>
                  </tr>
                  <tr className="w-1/6 text-center">Total</tr>
                </thead>
                <tbody className="w-full flex flex-col overflow-y-scroll max-h-[16rem] scrollbar-thin scrollbar-thumb-green">
                  {JSON.parse(order.products).map((item: any, key: number) => {
                    return (
                      <td key={key}>
                        <td className="flex w-full border-green-200 border-b-2 py-2">
                          <td className="w-2/3 flex items-center">
                            <img
                              className="max-h-[5rem] max-w-[5rem]"
                              src={getProduct(item.code).image}
                              alt="img produto"
                            />
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
              <div className="flex flex-col justify-center items-center h-3/6 gap-4">
                <td className="text-center text-4xl font-bold font-main">
                  {`TOTAL: 
                ${formatValue(sum(order.products) / 100)}`}
                </td>
                <div className="flex justify-center items-center w-full gap-4">
                  <Button
                    type="submit"
                    text="Gerar Etiqueta"
                    onClick={(e) => {
                      generateLabel(e);
                    }}
                    className={`w-48 h-10 bg-green rounded-3xl ${
                      order.ticketUrl && "!cursor-not-allowed !bg-gray-500"
                    }`}
                    disabled={order.ticketUrl ? true : false}
                  />
                  {order.ticketUrl && (
                    <a
                      className={`w-48 h-10 bg-green rounded-3xl flex items-center justify-center text-white uppercase ${
                        !order.ticketUrl && "!cursor-not-allowed !bg-gray-500"
                      }`}
                      href={order.ticketUrl}
                      target="_blank"
                    >
                      Abrir Etiqueta
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
