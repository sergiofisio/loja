import dashboard from "../../assets/admin/dashboard.svg";
import dashboardUnselected from "../../assets/admin/dashboard-unselected.svg";
import store from "../../assets/admin/store.svg";
import storeUnselected from "../../assets/admin/store-unselected.svg";
import { useContext, useEffect, useState } from "react";
import userImg from "../../assets/user/User.svg";
import Card from "../../components/card";
import { formatValue } from "../../functions/functions";
import edit from "../../assets/admin/edit.svg";
import ModalAdminProduto from "../../components/modalAdminProduto";
import { GridLoader } from "react-spinners";
import ModalUser from "../../components/modalUser";
import { Accumulator, Order, Product, User } from "../../interfaces/interface";
// import Button from "../../components/button";
import ModalMelhorEnvio from "../../components/modalMelhorEnvio";
import { AppContext } from "../../context/context";

export default function Admin() {
  const [selectSidebar, setSelectSidebar] = useState("dashboard");
  const { infoDb } = useContext(AppContext);
  const [sort, setSort] = useState({
    users: infoDb.usuarios,
    produtos: infoDb.produtos,
  });
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState("");
  const [produto, setProduto] = useState("");
  const [sum, setSum] = useState(0);
  const [numberSold, setNumberSold] = useState(0);
  const [user, setUser] = useState({} as any);
  function sortHistoric(searchTerm: any) {
    if (searchTerm) {
      const searchHistoric = infoDb.usuarios.filter((item: any) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSort({ ...sort, users: searchHistoric });
    } else {
      setSort({ ...sort, users: infoDb.usuarios });
    }
  }

  function sortAllProducts(products: any, searchTerm: string) {
    if (searchTerm) {
      const searchHistoric = products.filter((item: any) =>
        item.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSort({ ...sort, produtos: searchHistoric });
    } else {
      setSort({ ...sort, produtos: products });
    }
  }

  function sumAllOrders(orders: Order[]) {
    const sum = orders
      .filter((order) => order.finished)
      .reduce((total, order) => {
        const orderTotal = JSON.parse(order.products).reduce(
          (orderSum: number, product: Product) =>
            orderSum + Number(product.amount),
          0
        );
        return total + orderTotal;
      }, 0);
    return formatValue(sum / 100);
  }

  useEffect(() => {
    if (!infoDb) return;

    const { sum, count } = infoDb.usuarios.reduce(
      (acc: Accumulator, user: User) => {
        const orderData = user.orders.reduce(
          (orderAcc: Accumulator, order) => {
            if (order.finished) {
              const orderSum =
                JSON.parse(order.products).reduce(
                  (orderSum: number, product: Product) =>
                    orderSum + Number(product.amount),
                  0
                ) / 100;
              return {
                sum: orderAcc.sum + orderSum,
                count: orderAcc.count + 1,
              };
            }
            return orderAcc;
          },
          { sum: 0, count: 0 }
        );
        return {
          sum: acc.sum + orderData.sum,
          count: acc.count + orderData.count,
        };
      },
      { sum: 0, count: 0 }
    );

    setSum(sum);
    setNumberSold(count);
  }, [infoDb]);

  return (
    <main className="flex w-full h-full px-6 py-4">
      <div className="flex flex-col justify-center h-full gap-6 ">
        <div
          onClick={() => {
            setSelectSidebar("dashboard");
          }}
          className={`flex flex-col justify-center items-center w-64 h-24 rounded-r-3xl rounded-bl-3xl cursor-pointer border-green border-2 ${
            selectSidebar === "dashboard"
              ? "bg-green border-green border-solid"
              : "border-dashed"
          }`}
        >
          <img
            className="w-12"
            src={
              selectSidebar === "dashboard" ? dashboard : dashboardUnselected
            }
            alt="icon dashboard"
          />
          <h2
            className={`font-main text-xl font-bold ${
              selectSidebar === "dashboard" ? "text-white" : "text-[#ADADAD]"
            }`}
          >
            Dashboard
          </h2>
        </div>
        <div
          onClick={() => {
            setSelectSidebar("product");
          }}
          className={`flex flex-col justify-center items-center w-64 h-24 rounded-r-3xl rounded-bl-3xl cursor-pointer border-green border-2 ${
            selectSidebar === "product"
              ? "bg-green border-green border-solid"
              : "border-dashed"
          }`}
        >
          <img
            className="w-12"
            src={selectSidebar === "product" ? store : storeUnselected}
            alt="icon store"
          />
          <h2
            className={`font-main text-xl font-bold ${
              selectSidebar === "product" ? "text-white" : "text-[#ADADAD]"
            }`}
          >
            Produtos
          </h2>
        </div>
        <h2 className="text-center font-main text-sm text-[#253D4E] font-medium">{`${
          infoDb.produtos.length ? infoDb.produtos.length : ""
        } produtos cadastrados`}</h2>
        {/* <div className="flex flex-col items-center gap-4">
          <h2 className="flex flex-col justify-center items-center w-64 rounded-3xl border-green border-2 bg-green text-white">
            Saldo MELHOR ENVIO:{" "}
            <p className="font-main text-3xl font-bold">{formatValue(saldo)}</p>
          </h2>

          <Button
            className="bg-green w-fit p-3 rounded-3xl border-2 border-solid border-green transition-all duration-500 hover:bg-white hover:text-green cursor-pointer"
            type="button"
            text="Adicionar Saldo"
            onClick={() => setShowModal("saldo")}
          />
        </div> */}
      </div>
      <div className="w-full">
        {selectSidebar === "dashboard" && (
          <>
            <div className="flex flex-col w-full h-full px-6 gap-4">
              <h2 className="font-main text-3xl text-[#253D4E] font-semibold">
                Dados de Vendas
              </h2>
              <div className="flex justify-between">
                <Card
                  classname="flex flex-col justify-evenly w-52 h-28 bg-[#C5EAD9] rounded-2xl text-[#1C1C1C] font-main text-xl font-semibold p-5"
                  text="Vendas"
                  info={numberSold}
                />
                <Card
                  classname="flex flex-col justify-evenly w-52 h-28 bg-[#3BB77E] rounded-2xl text-[#1C1C1C] font-main text-xl font-semibold p-5"
                  text="Receita"
                  info={formatValue(sum)}
                />
              </div>
              <div className="bg-[#F3F3F3] h-12 border-2 border-gray-500 border-none rounded-3xl flex items-center gap-4 px-4">
                <label htmlFor="search">Pesquisar</label>
                <input
                  className="bg-transparent w-full h-full outline-none"
                  type="search"
                  onChange={(e) => {
                    setSearch(e.target.value);
                    sortHistoric(e.target.value);
                  }}
                  value={search}
                  name="search"
                  id="search"
                />
              </div>
              <div className="w-full h-full">
                <table className="flex flex-col w-full h-full">
                  <thead className="flex gap-1 text-black font-main text-base font-semibold border-b-2 border-greenScale-200 border-solid">
                    <tr className="flex items-center justify-evenly w-full border-b-2 border-solid border-greenScale-200 py-2">
                      <th className="w-1/5 border-r-2 border-dotted border-greenScale-600">
                        ID
                      </th>

                      <th className="w-1/5 border-r-2 border-dotted border-greenScale-600">
                        Nome
                      </th>

                      <th className="w-1/5 border-r-2 border-dotted border-greenScale-600">
                        Pedidos finalizados
                      </th>

                      <th className="w-1/5 border-r-2 border-dotted border-greenScale-600">
                        Estado
                      </th>

                      <th className="w-1/5">Valor total compras</th>
                    </tr>
                  </thead>
                  <tbody className="flex flex-col gap-1 text-black font-main text-base font-semibold overflow-y-auto max-h-[90%] scrollbar-thin scrollbar-thumb-green">
                    {infoDb.usuarios.length ? (
                      infoDb.usuarios.map(({ user, orders }: any, key: any) => {
                        console.log({ user });

                        return (
                          <tr
                            className="relative flex items-center justify-evenly w-full border-b-2 border-solid border-greenScale-200 py-2 hover cursor-pointer"
                            onClick={() => {
                              setShowModal("user");
                              setUser({ user, orders });
                            }}
                            key={key}
                          >
                            <td className="absolute flex items-center justify-center top-0 text-white font-black w-full h-full text-base opacity-0 bg-gray-500 transition-all duration-300 ease-in-out hover:opacity-80">
                              <h2>Clique para mais informações</h2>
                            </td>
                            <td className="w-1/5 text-center border-r-2 border-dotted border-greenScale-600 md:text-sm">
                              {user.id}
                            </td>
                            <td className="w-1/5 text-center border-r-2 border-dotted border-greenScale-600">
                              {user.name}
                            </td>
                            <td className="w-1/5 text-center border-r-2 border-dotted border-greenScale-600">
                              {
                                orders.filter((item: any) => item.finished)
                                  .length
                              }
                            </td>
                            <td
                              className={`w-1/5 text-center border-r-2 border-dotted border-greenScale-600`}
                            >
                              {!user.address ? "UN" : user.address.state}
                            </td>
                            <td className="w-1/5 text-center">
                              {sumAllOrders(orders)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        {selectSidebar === "product" && (
          <div className="flex max-w-[calc(100vw-35rem)] h-full flex-col px-6 gap-4">
            <h2 className="font-main text-3xl text-[#253D4E] font-semibold">
              Produtos
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex gap-4 h-56 overflow-x-auto scrollbar-thin scrollbar-thumb-green p-2">
                {!infoDb.produtos.length ? (
                  <div>
                    <GridLoader color="#000" />
                    <h2>Carregando...</h2>
                  </div>
                ) : (
                  infoDb.produtos
                    .sort((a: { id: number }, b: { id: number }) => a.id - b.id)
                    .map((product: any) => {
                      return (
                        <div
                          key={product.id}
                          className="border-2 border-grey border-solid rounded-3xl flex flex-col items-center justify-center cursor-pointer p-4 min-w-[11rem] h-full"
                        >
                          <img
                            className="h-24"
                            src={product.image}
                            alt={`imagem de ${product.name}`}
                          />
                          <h2 className="text-2xl text-center">
                            {product.name}
                          </h2>
                        </div>
                      );
                    })
                )}
              </div>
              <div
                className="border-2 border-grey border-dashed rounded-3xl w-44 h-44 flex items-center justify-center cursor-pointer p-4"
                onClick={() => {
                  setShowModal("newProduct");
                }}
              >
                <h2 className="text-2xl text-center">Adicionar novo +</h2>
              </div>
            </div>
            <div>
              <div className="bg-[#F3F3F3] h-12 border-2 border-gray-500 border-none rounded-3xl flex items-center gap-4 px-4">
                <label htmlFor="search">Pesquisar</label>
                <input
                  className="bg-transparent w-full h-full outline-none"
                  type="search"
                  onChange={(e) => {
                    setSearch(e.target.value);
                    sortAllProducts(infoDb.products, e.target.value);
                  }}
                  value={search}
                  name="search"
                  id="search"
                />
              </div>
              <div className="flex w-full">
                <table className="flex flex-col w-full">
                  <thead className="flex w-full justify-between items-center font-main text-4xl font-semibold py-3 border-b-4 border-green border-solid">
                    <tr className="w-20 flex justify-center ">
                      <th></th>
                    </tr>
                    <tr className="w-3/4 flex justify-center ">
                      <th>Produto</th>
                    </tr>
                    <tr className="w-1/4 flex justify-center">
                      <th>Estoque</th>
                    </tr>
                    <tr className="w-1/4 flex justify-center">
                      <th>Preço</th>
                    </tr>
                    <tr className="w-1/4 flex justify-center">
                      <th>Editar</th>
                    </tr>
                  </thead>
                  <tbody
                    className="flex flex-col w-full justify-between items-center py-3 gap-2 max-h-96 overflow-y-scroll scrollbar-thin scrollbar-thumb-green"
                    key="1254687421348643543"
                  >
                    {!infoDb.produtos.length ? (
                      <div>
                        <GridLoader color="#000" />
                        <h2>Carregando...</h2>
                      </div>
                    ) : (
                      infoDb.produtos
                        .sort(
                          (a: { id: number }, b: { id: number }) => a.id - b.id
                        )
                        .map((product: any) => {
                          return (
                            <tr
                              className="w-full flex justify-center font-main text-xl font-normal "
                              key={product.id}
                            >
                              <td className="w-20 flex justify-center items-center">
                                {product.id}
                              </td>
                              <td className="w-3/4 flex justify-center ">
                                {product.name}
                              </td>
                              <td className="w-1/4 flex justify-center ">
                                {product.stock}
                              </td>
                              <td className="w-1/4 flex justify-center ">
                                {formatValue(product.price / 100)}
                              </td>
                              <td className="w-1/4 flex justify-center ">
                                <img
                                  onClick={() => {
                                    setProduto(product), setShowModal("edit");
                                  }}
                                  className="cursor-pointer"
                                  src={edit}
                                  alt=""
                                />
                              </td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 w-2/12">
        <div>
          <h2 className="font-main text-xl font-semibold text-black">
            Usuários
          </h2>
          <div className="flex flex-col gap-3 overflow-y-auto max-h-64 scrollbar-thin scrollbar-thumb-green">
            {infoDb.usuarios.length &&
              infoDb.usuarios.map((user: any, key: number) => {
                return (
                  <div className="flex w-full items-center gap-2 " key={key}>
                    <div className="border-green rounded-full border-2 p-1">
                      <img
                        className="min-w-5"
                        src={userImg}
                        alt="icon userImg"
                      />
                    </div>
                    <h2 className="font-main text-sm text-[#1C1C1C]">
                      {user.user.name}
                    </h2>
                  </div>
                );
              })}
          </div>
        </div>
        <div>
          <h2 className="font-main text-xl font-semibold text-black">
            Parceiros
          </h2>
          <div className="flex flex-col gap-3 overflow-y-auto max-h-64 scrollbar-thin scrollbar-thumb-green">
            {infoDb.parceiros.length &&
              infoDb.parceiros.map((user: any, key: any) => {
                return (
                  <div className="flex w-full items-center gap-2 " key={key}>
                    <div className="border-green rounded-full border-2 p-1">
                      <img className="w-5" src={userImg} alt="icon userImg" />
                    </div>
                    <h2 className="font-main text-sm text-[#1C1C1C]">
                      {user.profissional}
                    </h2>
                  </div>
                );
              })}
          </div>
        </div>
        <div>
          <h2 className="font-main text-xl font-semibold text-black">
            Avaliações
          </h2>
          <div className="flex flex-col gap-3 overflow-y-auto max-h-64 scrollbar-thin scrollbar-thumb-green">
            {infoDb.depoimentos.length &&
              infoDb.depoimentos.map((user: any, key: any) => {
                return (
                  <div className="flex w-full items-center gap-2 " key={key}>
                    <div className="border-green rounded-full border-2 p-1">
                      <img className="w-5" src={userImg} alt="icon userImg" />
                    </div>
                    <h2 className="font-main text-sm text-[#1C1C1C]">
                      {user.nome}
                    </h2>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      {(showModal === "newProduct" || showModal === "edit") && (
        <ModalAdminProduto
          type={showModal}
          produto={produto}
          setProduto={setProduto}
          setShowModal={setShowModal}
        />
      )}
      {showModal === "user" && (
        <ModalUser
          products={infoDb.produtos}
          user={user.user}
          orders={user.orders}
          setShowModal={setShowModal}
        />
      )}
      {showModal === "saldo" && (
        <ModalMelhorEnvio setShowModal={setShowModal} />
      )}
    </main>
  );
}
