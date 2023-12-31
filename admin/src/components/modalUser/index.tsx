import { useEffect, useState } from "react";
import closeBtn from "../../assets/closeBtn.svg";
import { formatValue } from "../../functions/functions";
import InfoModalUser from "./info";
import { format } from "date-fns";
import left from "../../assets/left.svg";
import Card from "../card";

export default function ModalUser({
  user,
  orders,
  setShowModal,
}: {
  user: any;
  orders: any;
  setShowModal: any;
}) {
  console.log(user);

  const [page, setPage] = useState(1);
  const [begin, setBegin] = useState(0);
  const [sort, setSort] = useState(orders);
  const [sumPaid, setSumPaid] = useState(0);
  const [sumPending, setSumPending] = useState(0);
  const [sumFail, setSumFail] = useState(0);

  function sortHistoric(searchTerm: any) {
    console.log({ searchTerm });

    if (searchTerm) {
      const searchHistoric = orders.filter((item: any) =>
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log({ searchHistoric });
      setSort(searchHistoric);
    } else {
      setSort(orders);
    }
  }

  useEffect(() => {
    let count = 0;
    let sumPaid = 0;
    let sumFail = 0;
    let sumPending = 0;
    orders.forEach((order: any) => {
      console.log(order.status);
      if (order.status === "paid") {
        sumPaid += Number(order.amount / 100);
        count++;
      } else if (order.status === "canceled") {
        sumFail += Number(order.amount / 100);
        count++;
      } else if (order.status === "pending") {
        sumPending += Number(order.amount / 100);
        count++;
      }
    });
    setSumPaid(sumPaid);
    setSumFail(sumFail);
    setSumPending(sumPending);
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
                  {` ${user.address.line_1} - ${user.address.line_2}`}
                </h2>
                <h2 className="font-main text-white text-xl font-medium">
                  {` ${user.address.city}, ${user.address.state} - ${user.address.zip_code}`}
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
                  >
                    <h2 className="w-1/4 text-center">{order.id}</h2>
                    <h2 className="w-1/4 text-center">
                      {format(new Date(order.created_at), "dd/MM/yyyy")}
                    </h2>
                    <h2 className="w-1/4 text-center">
                      {formatValue(order.amount / 100)}
                    </h2>
                    <h2
                      className={`w-1/4 text-center rounded-3xl ${
                        order.status === "paid"
                          ? "text-greenScale-600 bg-greenScale-200"
                          : order.status === "pending"
                          ? "text-yellow-600 bg-yellow-200"
                          : "text-red-600 bg-red-200"
                      }`}
                    >
                      {order.status === "paid"
                        ? "Pago"
                        : order.status === "pending"
                        ? "Pedente"
                        : "Falho"}
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
                info={formatValue(sumPaid)}
              />
              <Card
                classname="flex flex-col justify-evenly w-full h-28 bg-yellow-200 rounded-2xl text-yellow-500 font-main text-xl font-semibold p-5"
                text="Pedidos pendentes"
                info={formatValue(sumPending)}
              />
              <Card
                classname="flex flex-col justify-evenly w-full h-28 bg-red-200 rounded-2xl text-red-500 font-main text-xl font-semibold p-5"
                text="Pedidos Falhos"
                info={formatValue(sumFail)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
