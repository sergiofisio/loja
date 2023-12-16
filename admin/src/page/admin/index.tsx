import dashboard from "../../assets/admin/dashboard.svg";
import dashboardUnselected from "../../assets/admin/dashboard-unselected.svg";
import store from "../../assets/admin/store.svg";
import storeUnselected from "../../assets/admin/store-unselected.svg";
import { useEffect, useState } from "react";
import axiosPrivate from "../../Service/api";
import userImg from "../../assets/user/User.svg";
import { localconfig } from "../../utils/localConfig";
import Card from "../../components/card";
import { formatValue } from "../../functions/functions";
import edit from "../../assets/admin/edit.svg";
import ModalAdminProduto from "../../components/modalAdminProduto";
import { format } from "date-fns";

export default function Admin() {
  const [selectSidebar, setSelectSidebar] = useState("dashboard");
  const [infoDb, setInfoDb]: any = useState({
    depoimentos: [],
    historicos: [],
    parceiros: [],
    produtos: [],
    usuarios: [],
  });
  const [sort, setSort] = useState({
    historico: [],
    produtos: [],
  });
  const [selected, setSelected] = useState("Todas");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState("");
  const [produto, setProduto] = useState("");

  async function getAllInfoDb() {
    try {
      const {
        data: { products, users, testimonials, partners },
      } = await axiosPrivate.get(
        "/infoDb",
        localconfig.getAuth(localStorage.getItem("token"))
      );

      setInfoDb({
        depoimentos: testimonials,
        historicos: [],
        parceiros: partners,
        produtos: products,
        usuarios: users.filter(
          (user: any) => user.id !== localStorage.getItem("usuarioId")
        ),
      });

      setSort({
        historico: [],
        produtos: products,
      });
    } catch (error) {
      console.log(error);
    }
  }

  function sortHistoric(historic: any, searchTerm: any) {
    console.log("teste", historic, searchTerm);
    // if (searchTerm) {
    //   const searchHistoric = historic.filter((item) =>
    //     item.idPagamento.includes(searchTerm)
    //   );
    //   setSortHistorico(searchHistoric);
    // } else {
    //   setSortHistorico(historic);
    // }
  }

  function sortAllProducts(products: any, searchTerm: any) {
    if (searchTerm) {
      const searchHistoric = products.filter((item: any) =>
        item.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSort({ ...sort, historico: searchHistoric });
    } else {
      setSort({ ...sort, produtos: products });
    }
  }

  function sumOrders(orders: any) {
    let sum = 0;
    for (const order of orders) {
      sum += Number(order.valorTotal);
    }
    return sum;
  }

  useEffect(() => {
    getAllInfoDb();
  }, [showModal]);
  return (
    <main className="relative flex w-full h-full px-6 py-12">
      <div className="flex flex-col justify-center h-full gap-6">
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
      </div>
      <div className="w-full">
        {selectSidebar === "dashboard" && (
          <>
            <div className="flex flex-col px-6 gap-4">
              <h2 className="font-main text-3xl text-[#253D4E] font-semibold">
                Dados de Vendas
              </h2>
              <div className="flex justify-between">
                <Card
                  classname="flex flex-col justify-evenly w-52 h-28 bg-[#C5EAD9] rounded-2xl text-[#1C1C1C] font-main text-xl font-semibold p-5"
                  text="Vendas"
                  info={infoDb.historicos.length ? infoDb.historicos.length : 0}
                />
                <Card
                  classname="flex flex-col justify-evenly w-52 h-28 bg-[#3BB77E] rounded-2xl text-[#1C1C1C] font-main text-xl font-semibold p-5"
                  text="Receita"
                  info={formatValue(sumOrders(infoDb.historicos))}
                />
              </div>
              <div className="bg-[#F3F3F3] h-12 border-2 border-gray-500 border-none rounded-3xl flex items-center gap-4 px-4">
                <label htmlFor="search">Pesquisar</label>
                <input
                  className="bg-transparent w-full h-full outline-none"
                  type="search"
                  onChange={(e) => {
                    setSearch(e.target.value);
                    sortHistoric(infoDb.historicos, e.target.value);
                  }}
                  value={search}
                  name="search"
                  id="search"
                />
              </div>
              <div className="w-full h-full">
                <table className="flex flex-col">
                  <thead className="flex w-full justify-evenly border-b-2 border-greenScale-200 border-solid">
                    <tr
                      onClick={() => {
                        setSelected("Todas");
                      }}
                      className={`w-full cursor-pointer border-b-4 border-green pb-2 ${
                        selected === "Todas" ? "border-solid" : "border-none"
                      }`}
                    >
                      <th>Todas</th>
                    </tr>
                    <tr
                      onClick={() => {
                        setSelected("andamento");
                      }}
                      className={`w-full cursor-pointer border-b-4 border-green pb-2 ${
                        selected === "andamento"
                          ? "border-solid"
                          : "border-none"
                      }`}
                    >
                      <th>Em andamento</th>
                    </tr>
                    <tr
                      onClick={() => {
                        setSelected("concluido");
                      }}
                      className={`w-full cursor-pointer border-b-4 border-green pb-2 ${
                        selected === "concluido"
                          ? "border-solid"
                          : "border-none"
                      }`}
                    >
                      <th>Concluido</th>
                    </tr>
                    <tr
                      onClick={() => {
                        setSelected("negado");
                      }}
                      className={`w-full cursor-pointer border-b-2 border-green ${
                        selected === "negado" ? "border-solid" : "border-none"
                      }`}
                    >
                      <th>Negado</th>
                    </tr>
                  </thead>
                  <tbody className="flex flex-col gap-1 text-black font-main text-base font-semibold overflow-y-scroll max-h-96 scrollbar-thin scrollbar-thumb-green">
                    {sort.historico.length ? (
                      sort.historico.map((vendas: any, key: any) => {
                        return (
                          <tr
                            className="flex items-center justify-evenly w-full border-b-2 border-solid border-greenScale-200 py-2"
                            key={key}
                          >
                            <td className="w-full">
                              {format(vendas.data, "dd/MM/yyyy")}
                            </td>
                            <td className="w-full">{vendas.idPagamento}</td>
                            <td
                              className={`w-2/4 text-center rounded-3xl ${
                                vendas.status === "Paid"
                                  ? "text-greenScale-600 bg-greenScale-200"
                                  : vendas.status === "Pending"
                                  ? "text-yellow-600 bg-yellow-200"
                                  : "text-red-600 bg-red-200"
                              }`}
                            >
                              {vendas.status === "Paid"
                                ? "Pago"
                                : vendas.status === "Pending"
                                ? "Pendente"
                                : "Falho"}
                            </td>
                            <td className="w-2/4 text-center">
                              {formatValue(vendas.valorTotal)}
                            </td>
                            <td
                              className={`w-3/4 text-center rounded-3xl ${
                                vendas.andamentoRastreio === "Entregue"
                                  ? "text-greenScale-600 bg-greenScale-200"
                                  : vendas.andamentoRastreio === "Em andamento"
                                  ? "text-yellow-600 bg-yellow-200"
                                  : "text-red-600 bg-red-200"
                              }`}
                            >
                              {vendas.andamentoRastreio}
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
          <div className="flex flex-col px-6 gap-4">
            <h2 className="font-main text-3xl text-[#253D4E] font-semibold">
              Produtos
            </h2>
            <div
              className="border-2 border-grey border-dashed rounded-3xl w-36 h-28 flex items-center justify-center cursor-pointer"
              onClick={() => {
                setShowModal("create");
              }}
            >
              <h2 className="text-2xl text-center">Adicionar novo +</h2>
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
                    {infoDb.produtos.length ? (
                      infoDb.produtos.map((product: any) => {
                        return (
                          <tr
                            className="w-full flex justify-center font-main text-xl font-normal "
                            key={product.id}
                          >
                            <td className="w-3/4 flex justify-center ">
                              {product.name}
                            </td>
                            <td className="w-1/4 flex justify-center ">
                              {product.stock}
                            </td>
                            <td className="w-1/4 flex justify-center ">
                              {formatValue(product.price)}
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
                    ) : (
                      <tr></tr>
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
          <div className="flex flex-col gap-3 overflow-y-scroll max-h-64 scrollbar-thin scrollbar-thumb-green">
            {infoDb.usuarios.length &&
              infoDb.usuarios.map((user: any, key: any) => {
                return (
                  <div className="flex w-full items-center gap-2 " key={key}>
                    <div className="border-green rounded-full border-2 p-1">
                      <img className="w-5" src={userImg} alt="icon userImg" />
                    </div>
                    <h2 className="font-main text-sm text-[#1C1C1C]">
                      {user.name}
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
          <div className="flex flex-col gap-3 overflow-y-scroll max-h-64 scrollbar-thin scrollbar-thumb-green">
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
          <div className="flex flex-col gap-3 overflow-y-scroll max-h-64 scrollbar-thin scrollbar-thumb-green">
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
      {showModal && (
        <ModalAdminProduto
          type={showModal}
          produto={produto}
          setProduto={setProduto}
          setShowModal={setShowModal}
        />
      )}
    </main>
  );
}
