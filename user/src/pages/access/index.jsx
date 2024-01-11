import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../Service/api";
import arrowRight from "../../assets/access/ArrowRight.svg";
import img from "../../assets/access/img.svg";
import pointer from "../../assets/access/pointer.svg";
import ModalAdressCard from "../../components/modalAdressCard";
import { toastFail } from "../../context/toast";
import ModalUser from "../../components/modalUser";
import ModalOrder from "../../components/modalOrder";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import { formatValue } from "../../functions/functions";
import { DotLoader } from "react-spinners";

export default function Access({ setId, setAdress, setCard }) {
  const navigate = useNavigate();

  const [adress, setAdressUser] = useState({
    id: "",
    zip_code: "",
    line_1: "",
    line_2: "",
    city: "",
    state: "",
    country: "BR",
  });
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    document: "",
    orders: [],
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModalOrder, setShowModalOrder] = useState("");
  const [showModal, setShowModal] = useState("");

  async function handleModal(e, type) {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(type);
  }

  async function getUserInfo() {
    try {
      const {
        data: { user, adresses, orders },
      } = await axios.get(
        `/infoUser/${await AsyncStorage.getItem("usuarioId")}`,
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
          },
        }
      );
      if (adresses.length) {
        setAdressUser({
          id: adresses[0].id,
          zip_code: adresses[0].zip_code,
          line_1: adresses[0].line_1,
          line_2: adresses[0].line_2,
          city: adresses[0].city,
          state: adresses[0].state,
          country: "BR",
        });
      }
      setUser({
        ...user,
        id: user.id,
        name: user.name,
        email: user.email,
        document: user.document,
        phone: `+${user.phones.mobile_phone.country_code} (${
          user.phones.mobile_phone.area_code
        }) ${user.phones.mobile_phone.number.slice(
          0,
          5
        )}-${user.phones.mobile_phone.number.slice(5)}`,
      });
      setOrders(orders);
      setLoading(false);
    } catch (error) {
      console.log(error);
      if (error.response.status === 408) {
        toastFail(error.response.data.error);
        localStorage.clear();
        navigate("/");
      }
    }
  }

  function sumOrders(orders) {
    let total = 0;
    orders.forEach((order) => {
      total += order.amount;
    });
    return total;
  }

  function handleStore(e) {
    e.stopPropagation();
    if (!adress.line_1) {
      return toastFail("Você precisa preencher o endereço de entrega!");
    }
    navigate("/store");
  }

  useEffect(() => {
    getUserInfo();
  }, [showModal]);

  return (
    <main className="flex justify-center w-full max-h-[calc(100vh-6rem)] px-9">
      <div className="flex flex-col w-1/4 gap-4">
        <div
          onClick={(e) => handleStore(e)}
          className="flex items-center gap-4 cursor-pointer"
        >
          <img className="w-8 h-8" src={arrowRight} alt="icon Arrow rigth" />
          <h1 className="font-main text-lg font-semibold">Ir para a loja</h1>
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="font-main text-2xl font-semibold">
            Endereço de entrega
          </h1>
          <div className="relative flex w-full h-full">
            {!adress.zip_code ? (
              <div
                className="flex items-center justify-center w-32 h-36 border-green border-dashed rounded-2xl border-2 cursor-pointer"
                onClick={(e) => handleModal(e, "Endereço")}
              >
                <h2 className="font-main text-grey text-xl font-medium">
                  Adicionar +
                </h2>
              </div>
            ) : (
              <>
                <div
                  onClick={(e) => handleModal(e, "editar")}
                  className={`absolute flex flex-col justify-center items-center w-80 bg-gray-300 rounded-b-xl rounded-r-xl border-4 cursor-pointer p-4 h-full font-main text-black text-4xl font-medium bg-opacity-0 opacity-0 transition-all ease-in-out duration-500 hover:bg-opacity-70 hover:opacity-100`}
                >
                  EDITAR
                </div>
                <div
                  onClick={(e) => handleModal(e, "editar")}
                  className="flex flex-col items-start gap-3 justify-center w-80 bg-green border-green border-solid rounded-b-xl rounded-r-xl border-4 cursor-pointer p-4 h-full"
                >
                  <img src={pointer} alt="icon pointer" />
                  <h2 className="font-main text-white text-xl font-medium">
                    {` ${adress.line_1.split(",")[1]}, ${
                      adress.line_1.split(",")[0]
                    } - ${adress.line_1.split(",")[2]} ${
                      adress.line_2 ? `- ${adress.line_2}` : ""
                    }`}
                  </h2>
                  <h2 className="font-main text-white text-xl font-medium">
                    {`${adress.city}, ${adress.state}`} <br />{" "}
                    {`CEP: ${adress.zip_code}`}
                  </h2>
                </div>
              </>
            )}
          </div>
        </div>
        <img
          className="absolute bottom-0 flex self-center w-60"
          src={img}
          alt="img"
        />
      </div>
      <div className=" max-h-[80vh] w-1 bg-gradient-to-b from-[#fff] via-green to-[#fff]"></div>
      <div className="flex flex-col items-start w-3/4 p-8 gap-12 overflow-hidden">
        <div className="flex gap-12">
          <div className="flex flex-col justify-center items-start gap-6">
            <div>
              <h1 className="text-green font-main text-[2rem] font-semibold">
                {user.name}
              </h1>
              <h2 className="text-gray-900 font-main text-xl">{user.email}</h2>
            </div>
            <h1
              onClick={(e) => handleModal(e, "Editar")}
              className="text-green font-main text-lg cursor-pointer underline"
            >
              Editar
            </h1>
          </div>
        </div>
        <div className="flex flex-col w-full gap-5">
          <h1 className="text-[#253D4E] font-main font-semibold text-2xl">
            Histórico
          </h1>
          <div>
            <div className="flex ">
              <table className="flex flex-col w-full">
                <thead className="flex justify-between items-center w-full text-green font-main text-xl font-medium border-b-2 border-green py-4">
                  <tr className="flex justify-between items-center w-full">
                    <th className="flex justify-center border-grey border-opacity-40 border-r-2 w-1/3">
                      <h2>Código pedido</h2>
                    </th>
                    <th className="flex justify-center border-grey border-opacity-40 border-r-2 w-1/6">
                      <h2>Data</h2>
                    </th>
                    <th className="flex justify-center border-grey border-opacity-40 border-r-2 w-1/6">
                      <h2>Valor</h2>
                    </th>
                    <th className="flex justify-center border-grey border-opacity-40 border-r-2 w-1/6">
                      <h2>Pagamento</h2>
                    </th>
                    <th className="flex justify-center border-grey border-opacity-40 border-r-2 w-1/6">
                      <h2>Status</h2>
                    </th>
                  </tr>
                </thead>
                {loading ? (
                  <div className="flex flex-col justify-center items-center w-full">
                    <DotLoader color="#3bb77e" />
                    <h2>Carregando...</h2>
                  </div>
                ) : (
                  <tbody className="flex flex-col justify-between items-center w-full text-black font-main text-base font-medium border-b-2 border-green h-2/3 overflow-y-scroll">
                    {orders.length ? (
                      orders.map((order, key) => {
                        return (
                          <tr
                            className="relative flex justify-center border-grey border-opacity-40 border-b-2 py-2 w-full cursor-pointer"
                            key={key}
                            onClick={(e) => {
                              setShowModalOrder(order);
                            }}
                          >
                            <td className="absolute flex items-center justify-center top-0 text-white font-black w-full h-full text-base opacity-0 bg-gray-500 transition-all duration-300 ease-in-out hover:opacity-80">
                              <h2>Clique para acessar o pedido</h2>
                            </td>
                            <td className="flex justify-center border-grey border-opacity-40 border-r-2 w-1/3">
                              <h2>{order.idPagarme}</h2>
                            </td>
                            <td className="flex justify-center border-grey border-opacity-40 border-r-2 w-1/6">
                              <h2>
                                {format(new Date(order.date), "dd/MM/yyyy")}
                              </h2>
                            </td>
                            <td className="flex justify-center border-grey border-opacity-40 border-r-2 w-1/6">
                              <h2>
                                {formatValue(
                                  sumOrders(JSON.parse(order.products)) / 100
                                )}
                              </h2>
                            </td>
                            <td className="flex justify-center border-grey border-opacity-40 border-r-2 w-1/6">
                              <h2>
                                {order.transactionType === "pix"
                                  ? "Pix"
                                  : order.transactionType === "Não finalizado"
                                    ? "Não finalizado"
                                    : "Cartão de Crédito"}
                              </h2>
                            </td>
                            <td
                              className={`flex justify-center text-center w-1/6`}
                            >
                              <h2
                                className={`rounded-3xl ${
                                  order.status === "failed"
                                    ? "bg-red-200 text-red-600"
                                    : order.status === "pending"
                                      ? "bg-yellow-200 text-yellow-600"
                                      : "bg-greenScale-200 text-greenScale-600"
                                } w-1/2 px-5`}
                              >
                                {order.status === "failed"
                                  ? "Falhada"
                                  : order.status === "pending"
                                    ? "Pendente"
                                    : "Sucesso"}
                              </h2>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="flex items-center justify-center h-full w-full"
                        >
                          <h2 className="text-[#253D4E] font-main font-semibold text-2xl">
                            Você ainda não tem compras cadastradas.
                          </h2>
                        </td>
                      </tr>
                    )}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
      {showModal === "Endereço" || showModal === "editar" ? (
        <ModalAdressCard
          type={showModal}
          setShowModal={setShowModal}
          adressUser={adress}
        />
      ) : showModal === "Editar" ? (
        <ModalUser user={user} setUser={setUser} setShowModal={setShowModal} />
      ) : (
        ""
      )}
      {showModalOrder && (
        <ModalOrder
          setShowModalOrder={setShowModalOrder}
          order={showModalOrder}
        />
      )}
    </main>
  );
}
