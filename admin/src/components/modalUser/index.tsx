import { useEffect, useState } from "react";
import closeBtn from "../../assets/closeBtn.svg";
import { formatValue } from "../../functions/functions";
import InfoModalUser from "./info";
import { format } from "date-fns";
import left from "../../assets/left.svg";
import Card from "../card";
import ModalOrder from "../modalOrder";

export default function ModalUser({
  products,
  user,
  orders,
  setShowModal,
}: {
  products: any;
  user: any;
  orders: any;
  setShowModal: any;
}) {
  const [page, setPage] = useState(1);
  const [begin, setBegin] = useState(0);
  const [sort, setSort] = useState(
    [...orders].sort((a, b) => b.finished - a.finished) || []
  );
  const [sumPaid, setSumPaid] = useState("");
  const [sumFail, setSumFail] = useState("");
  const [showOrderInfo, setShowOrderInfo] = useState("");

  function sortHistoric(searchTerm: any) {
    console.log({ searchTerm });

    if (searchTerm) {
      const searchHistoric = orders.filter((item: any) =>
        item.idPagarme.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSort(searchHistoric);
    } else {
      setSort(orders);
    }
  }

  function sumValue(ordersItem: any) {
    const sum = JSON.parse(ordersItem).reduce((total: number, order: any) => {
      return total + Number(order.amount / 100);
    }, 0);
    return formatValue(sum);
  }

  useEffect(() => {
    const sumOrders = (orders: any[], finished: boolean) =>
      orders
        .filter((order: any) => order.finished === finished)
        .reduce((total: number, order: any) => {
          const orderTotal = JSON.parse(order.products).reduce(
            (orderSum: number, product: any) =>
              orderSum + Number(product.amount),
            0
          );
          return total + orderTotal;
        }, 0);

    const sumPaid = sumOrders(orders, true);
    const sumFail = sumOrders(orders, false);

    setSumPaid(formatValue(sumPaid / 100));
    setSumFail(formatValue(sumFail / 100));
  }, []);

  return (
    <div className="flex flex-col justify-center items-center bg-bgModal absolute top-0 left-0 w-full h-full">
      <div
        className={`relative flex flex-col justify-evenly w-11/12 h-[90%] 1536:h-[90%] 1366:h-[90%] bg-white rounded-3xl p-8 shadow-green shadow-2xl`}
      >
        <img
          onClick={() => {
            setShowModal("");
          }}
          className="absolute top-6 right-6 cursor-pointer"
          src={closeBtn}
          alt="btnClose"
        />
        <div className="flex min-w-1/2 h-full gap-4">
          <div className="flex flex-col w-full gap-4">
            <h2>Informações</h2>
            <InfoModalUser label="Id" value={user.id} />
            <InfoModalUser label="Nome" value={user.name} />
            <div className="flex gap-4">
              <InfoModalUser label="E-mail" value={user.email} />
              <InfoModalUser
                label="CPF"
                value={`${user.document
                  .slice(0, 3)
                  .replace(/(\d{3})(?=\d)/g, "$1.")}.${user.document
                  .slice(3, 6)
                  .replace(/(\d{3})(?=\d)/g, "$1.")}-${user.document.slice(
                  6,
                  10
                )}`}
              />
            </div>
            <div>
              <h2>Endereço</h2>
              <div className="flex flex-col items-start gap-3 justify-center w-80 bg-green border-green border-solid rounded-b-xl rounded-r-xl border-4 cursor-pointer p-4 h-full">
                <h2 className="font-main text-white text-xl font-medium">
                  {` ${user.address.line_1.split(",")[1]},  ${
                    user.address.line_1.split(",")[0]
                  } - ${user.address.line_1.split(",")[2]} ${
                    user.address.line_2 ? `- ${user.address.line_2}` : ""
                  }`}
                </h2>
                <h2 className="font-main text-white text-xl font-medium">
                  {` ${user.address.city}, ${user.address.state}`} <br />{" "}
                  {`CEP: ${user.address.zip_code}`}
                </h2>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full gap-4">
            <h2 className="text-3xl font-semibold text-center">Pedidos</h2>
            <div>
              <label htmlFor="search">Pesquisa</label>
              <input
                className="bg-transparent border-2 border-green border-solid h-10 w-full rounded-3xl p-3 outline-none"
                type="search"
                onChange={(e) => sortHistoric(e.target.value)}
                name="search"
                id="search"
              />
            </div>
            <div>
              <div className="flex border-b-2 border-solid border-b-green">
                <h2 className="w-1/4 text-center font-semibold">Id</h2>
                <h2 className="w-1/4 text-center font-semibold border-l-2 border-dotted border-x-green">
                  Data
                </h2>
                <h2 className="w-1/4 text-center font-semibold border-l-2 border-dotted border-x-green">
                  Valor
                </h2>
                <h2 className="w-1/4 text-center font-semibold border-l-2 border-dotted border-x-green">
                  Status
                </h2>
              </div>
              {sort.slice(begin, begin + 10).map((order: any, key: any) => {
                return (
                  <div
                    className="flex items-center border-b-2 border-dashed border-b-green h-7"
                    key={key}
                    onClick={() => {
                      setShowOrderInfo(order);
                    }}
                  >
                    <h2 className="w-1/4 text-center">{order.idPagarme}</h2>
                    <h2 className="w-1/4 text-center">
                      {format(new Date(order.date), "dd/MM/yyyy")}
                    </h2>
                    <h2 className="w-1/4 text-center">
                      {sumValue(order.products)}
                    </h2>
                    <h2
                      className={`w-1/4 text-center rounded-3xl ${
                        order.finished
                          ? "text-greenScale-600 bg-greenScale-200"
                          : "text-red-600 bg-red-200"
                      }`}
                    >
                      {order.finished ? "Pago" : "Falho"}
                    </h2>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center items-center">
              <img
                className="cursor-pointer w-10 h-10"
                src={left}
                alt=""
                onClick={() => {
                  if (page <= 1) return;
                  setPage(page - 1);
                  setBegin(begin - 10);
                }}
              />
              <h2>
                {page} de {Math.ceil(orders.length / 10)}
              </h2>
              <img
                className="rotate-180 cursor-pointer w-10 h-10"
                src={left}
                alt=""
                onClick={() => {
                  if (page > Math.ceil(orders.length / 10) - 1) return;
                  setPage(page + 1);
                  setBegin(begin + 10);
                }}
              />
            </div>
            <div className="flex justify-evenly gap-10">
              <Card
                classname="flex flex-col justify-evenly w-full h-28 bg-greenScale-200 rounded-2xl text-greenScale-600 font-main text-xl font-semibold p-5"
                text="Pedidos pagos"
                info={sumPaid}
              />
              <Card
                classname="flex flex-col justify-evenly w-full h-28 bg-red-200 rounded-2xl text-red-500 font-main text-xl font-semibold p-5"
                text="Pedidos Falhos"
                info={sumFail}
              />
            </div>
          </div>
        </div>
      </div>
      {showOrderInfo && (
        <ModalOrder
          user={user}
          products={products}
          setShowOrderInfo={setShowOrderInfo}
          order={showOrderInfo}
        />
      )}
    </div>
  );
}
