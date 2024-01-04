import { useEffect, useState } from "react";
import { localconfig } from "../../utils/localConfig";
import axios from "../../Service/api";
import trash from "../../assets/cart/trash.svg";
import cart from "../../assets/cart/cart-green.svg";
import minus from "../../assets/cart/minus.svg";
import plus from "../../assets/cart/plus.svg";
import check from "../../assets/cart/checked.svg";
import uncheck from "../../assets/cart/unchecked.svg";
import link from "../../assets/cart/link.svg";
import Input from "../../components/input/form/input";
import img from "../../assets/cart/img.svg";
import img2 from "../../assets/cart/img2.svg";
import img3 from "../../assets/cart/img3.svg";
import img4 from "../../assets/cart/img4.svg";
import Button from "../../components/button";
import pointer from "../../assets/cart/pointer.svg";
import truck from "../../assets/cart/truck.svg";
import { toastFail, toastSuccess } from "../../context/toast";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DotLoader } from "react-spinners";

export default function Cart() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState("");
  const [sedex, setSedex] = useState("");
  const [pac, setPac] = useState("");
  const [adressUser, setAdressUser] = useState("");
  const [changeProductCart, setchangeProductCart] = useState(false);
  const [value, setValue] = useState(0);
  const [weigth, setWeigth] = useState(0);
  const [step, setStep] = useState("step1");
  const [selectedOption, setSelectedOption] = useState("Sedex");
  const [cupom, setCupom] = useState("");
  const [id_parceiro, setId_parceiro] = useState(null);
  const [parceiro, setParceiro] = useState("");
  const [paymentOk, setPaymentOk] = useState(false);
  const [order, setOrder] = useState("");
  const [checkout, setCheckout] = useState("");
  const [urlCheckout, setUrlCheckout] = useState("");

  console.log(userInfo);

  function calcWeight() {
    let weigth = 0;
    let sum = 0;
    for (const product of JSON.parse(localStorage.getItem("cart"))) {
      weigth += Number(product.product.peso) * product.quantidade;
      sum += Number(product.product.preco) * product.quantidade;
    }
    setValue(sum / 100);
    setWeigth(weigth);
    return String(weigth);
  }

  function sumValueFrete(inputString, frete) {
    const numericString = frete.replace(/[^\d,]/g, "");
    const numericValue = Math.round(
      parseFloat(numericString.replace(",", "."))
    );
    return (numericValue / 100) * 1.2 + inputString;
  }

  function changeQtd(e, id, operation) {
    e.stopPropagation();
    let cart = JSON.parse(localStorage.getItem("cart"));

    if (operation === "delete") {
      cart = cart.filter((item) => item.product.id !== id);
    }
    const itemIndex = cart.findIndex((item) => item.product.id === id);
    if (operation === "sum") {
      cart[itemIndex].quantidade += 1;
    }
    if (operation === "minus" && cart[itemIndex].quantidade > 1) {
      cart[itemIndex].quantidade -= 1;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    setchangeProductCart(!changeProductCart);
  }

  async function getFrete() {
    try {
      const {
        data: { user, adresses },
      } = await axios.get(
        `/infoUser/${await AsyncStorage.getItem("usuarioId")}`,
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
          },
        }
      );

      setUserInfo({ user });
      setAdressUser(adresses[0]);

      const {
        data: { frete },
      } = await axios.get(`/frete/${adresses[0].zip_code}`, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      });
      for (const calculo of frete) {
        if (calculo.name === "PAC") setPac(calculo);
        if (calculo.name === "SEDEX") setSedex(calculo);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function createOrder(e) {
    e.preventDefault();
    e.stopPropagation();

    let frete = "";
    if (selectedOption === "Sedex") {
      frete = sedex.price * 1.2;
    } else {
      frete = pac.price * 1.2;
    }
    const data = moment().format("DD/MM/YYYY, h:mm:ss");

    frete = Math.round(frete * 100);

    try {
      const order = await axios.post(
        `/createOrder/${await AsyncStorage.getItem("usuarioId")}`,
        {
          address_id: adressUser.id,
          line_1: adressUser.line_1,
          line_2: adressUser.line_2,
          state: adressUser.state,
          city: adressUser.city,
          zip_code: adressUser.zip_code,
          items: JSON.parse(localStorage.getItem("cart")),
          recipient_name: userInfo.user.name,
          recipient_phone: userInfo.user.phones.mobile_phone,
          email: userInfo.user.email,
          frete,
          amount: value * 100 + frete,
          description: `Pedido de ${userInfo.user.name}`,
          data,
          compra: localStorage.getItem("cart"),
          cupom,
          installments: 10,
          id_parceiro,
          parceiro,
        },
        localconfig.getAuth(localStorage.getItem("token"))
      );

      setUrlCheckout(order.data.order.checkouts[0].payment_url);
      setCheckout(true);
      setOrder(order.data.order);
    } catch (error) {
      console.log(error);
    }
  }

  async function verifyPayment() {
    try {
      const response = await axios.get(`/verifyOrder/${order.id}`, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      });

      if (!response.data.order.charges) {
        return toastFail(
          "Seu pagamento não foi finalizado. Clique novamente para terminar!",
          3000
        );
      }

      if (response.data.order.charges[0].status === "failed") {
        return toastFail(
          "Seu pagamento foi negado. Reveja os dados. Clique para pagar e tente novamente",
          3000
        );
      }
      toastSuccess("Seu pagamento está sendo processado", 3000, "top-left");
      setPaymentOk(true);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleChangeStep(e) {
    e.preventDefault();
    e.stopPropagation();

    if (step === "step1") {
      const options = {
        Sedex: { error: sedex.error, message: "Sedex indisponível" },
        PAC: { error: pac.error, message: "PAC indisponível" },
      };

      if (options[selectedOption]?.error) {
        return toastFail(options[selectedOption].message);
      }

      for (const product of JSON.parse(localStorage.getItem("cart"))) {
        if (!product.quantidade) {
          return toastFail(
            "Há algum produto que esta com quantidade 0. Verifique por favor!!"
          );
        }
      }
      setStep("step2");
    }
    if (step === "step2") {
      setStep("step3");
    }
    if (step === "step3") {
      // sendOrderInfo();
      setStep("step4");
    }
    if (step === "step4") {
      await AsyncStorage.removeItem("cart");
      await axios.patch(
        `/finishOrder/${order.id}`,
        { email: userInfo.user.email },
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
          },
        }
      );
      toastSuccess(
        "Sua compra foi concluída, você receberá um resumo da sua compra por email!",
        3000,
        "top-center"
      );
      setTimeout(() => {
        AsyncStorage.removeItem("cart");
        navigate("/home");
      }, 3000);
    }
  }

  // async function sendOrderInfo() {
  //   let shipping = "";
  //   if (selectedOption === "sedex") {
  //     shipping = sedex;
  //   } else {
  //     shipping = pac;
  //   }
  //   try {
  //     await axios.post(
  //       "/sendEmail",
  //       {
  //         order,
  //         shipping,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async function auth(token) {
    try {
      await axios.get("/verifyToken", localconfig.getAuth(token));
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 408) {
        toastFail("Sua sessão expirou!");
        return setTimeout(() => {
          localStorage.clear();
          navigate("/");
        }, 4000);
      }
    }
  }

  useEffect(() => {
    getFrete();
    calcWeight();

    auth(localStorage.getItem("token"));
  }, [changeProductCart]);

  return (
    <main className="relative flex justify-center w-full min-h-[calc(100vh-6rem)] p-9">
      <img
        className="absolute bottom-0 right-0"
        src={
          step === "step1"
            ? img
            : step === "step2"
              ? img2
              : step === "step3"
                ? img3
                : img4
        }
        alt="img"
      />
      <div className="flex flex-col w-1/3 min-h-full gap-2 m-4">
        <div className="flex justify-between px-4">
          <h1 className="font-main text-5xl text-green font-semibold">
            Carrinho
          </h1>
          <img src={cart} alt="img Cart" />
        </div>
        <div className="flex flex-col justify-between w-full h-full border-2 border-green rounded-2xl p-2">
          <table className="h-full">
            <thead className="flex justify-between border-b-2 border-greenScale-200 pr-2 1536:pr-0 1440:pr-0 1366:pr-0">
              <tr className="flex justify-between items-center w-full">
                <th className="w-full border-gray-200 border-r-2">Produto</th>
                <th className="w-1/2 border-gray-200 border-r-2">Valor</th>
                <th className="w-1/3">Qde</th>
                <th className="w-1/5 opacity-0">Excluir</th>
              </tr>
            </thead>
            <tbody className="flex flex-col max-h-[40rem] 1536:max-h-[20rem] 1440:max-h-[30rem] 1366:max-h-[22rem] overflow-y-scroll scrollbar-thin scrollbar-thumb-green">
              {JSON.parse(localStorage.getItem("cart")).map(
                ({ product, quantidade }, key) => {
                  return (
                    <tr
                      className="flex justify-center border-grey border-opacity-40 border-b-2 py-2 w-full font-main text-base"
                      key={key}
                    >
                      <td className="flex items-center gap-8 border-grey border-opacity-40 border-r-2 w-full font-medium">
                        <img
                          className="w-16 1536:w-14"
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
                }
              )}
            </tbody>
          </table>
          <table>
            <tbody className="flex flex-col justify-end min-h-[22%] ">
              <tr className="flex justify-center border-b-2 border-greenScale-200">
                <th className="">TOTAL</th>
              </tr>
              <tr className="flex justify-between items-center w-full border-grey  border-b-2">
                <th className="w-1/5 border-gray-200 border-r-2">Envio</th>
                <th className="w-1/5  border-gray-200 border-r-2">Frete</th>
                <th className="w-1/5  border-gray-200 border-r-2">Produtos</th>
                <th className="w-1/5  border-gray-200 border-r-2">Tempo</th>
                <th className="w-1/5">Total</th>
              </tr>
              <tr className="flex flex-col items-end  font-main text-base">
                <th className="flex justify-end w-full border-gray-400 border-b-2 border-dashed">
                  <h2 className="w-1/5 border-gray-200 border-r-2 font-normal">
                    Sedex
                  </h2>
                  {sedex.error ? (
                    <>
                      <h2 className="w-1/5  border-gray-200 border-r-2 font-normal">
                        indisponível para este CEP
                      </h2>
                      <h2 className="w-1/5  border-gray-200 border-r-2 font-normal"></h2>
                      <h2 className="w-1/5  border-gray-200 border-r-2 font-normal"></h2>
                      <h2 className="w-1/5 font-normal"></h2>
                    </>
                  ) : (
                    <>
                      <h2 className="w-1/5  border-gray-200 border-r-2 font-normal">
                        {sedex
                          ? `${(sedex.price * 1.2).toLocaleString("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            })}`
                          : ""}
                      </h2>
                      <h2 className="w-1/5  border-gray-200 border-r-2 font-normal">
                        {value.toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </h2>
                      <h2 className="w-1/5  border-gray-200 border-r-2 font-normal">
                        {sedex
                          ? `${Number(sedex.custom_delivery_time) + 2} dia(s)`
                          : ""}
                      </h2>
                      <h2 className="w-1/5 font-normal">
                        {sedex
                          ? `${sumValueFrete(value, sedex.price).toLocaleString(
                              "pt-br",
                              {
                                style: "currency",
                                currency: "BRL",
                              }
                            )}`
                          : ""}
                      </h2>
                    </>
                  )}
                </th>
                <th className="flex justify-end w-full">
                  <h2 className="w-1/5 border-gray-200 border-r-2 font-normal">
                    PAC
                  </h2>
                  {pac.error ? (
                    <>
                      <h2 className="w-1/5  border-gray-200 border-r-2 font-normal">
                        indisponível para este CEP
                      </h2>
                      <h2 className="w-1/5  border-gray-200 border-r-2 font-normal"></h2>
                      <h2 className="w-1/5  border-gray-200 border-r-2 font-normal"></h2>
                      <h2 className="w-1/5 font-normal"></h2>
                    </>
                  ) : (
                    <>
                      <h2 className="w-1/5  border-gray-200 border-r-2 font-normal">
                        {pac
                          ? `${(pac.price * 1.2).toLocaleString("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            })}`
                          : ""}
                      </h2>
                      <h2 className="w-1/5  border-gray-200 border-r-2 font-normal">
                        {value.toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </h2>
                      <h2 className="w-1/5  border-gray-200 border-r-2 font-normal">
                        {pac
                          ? `${Number(pac.custom_delivery_time) + 2} dia(s)`
                          : ""}
                      </h2>
                      <h2 className="w-1/5 font-normal">
                        {pac
                          ? `${sumValueFrete(value, pac.price).toLocaleString(
                              "pt-br",
                              {
                                style: "currency",
                                currency: "BRL",
                              }
                            )}`
                          : ""}
                      </h2>
                    </>
                  )}
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-col items-start w-2/3 min-h-full p-8 gap-12">
        <div className="flex w-full justify-center">
          <img
            className={`${step !== "step1" ? "bg-green w-8" : ""} rounded-full`}
            src={step !== "step1" ? check : uncheck}
            alt=""
          />
          <img
            className={` ${
              step === "step1" ? "opacity-100 gradient-mask-r-0" : "opacity-100"
            }`}
            src={link}
            alt=""
          />
          <img
            className={`${
              step === "step1"
                ? "opacity-70"
                : step === "step2"
                  ? "opacity-100"
                  : "opacity-100 bg-green w-8 rounded-full"
            }`}
            src={step !== "step1" && step !== "step2" ? check : uncheck}
            alt=""
          />
          <img
            className={` ${
              step === "step1"
                ? "opacity-20"
                : step === "step2"
                  ? "opacity-100 gradient-mask-r-0"
                  : "opacity-100"
            }`}
            src={link}
            alt=""
          />
          <img
            className={`${
              step === "step1"
                ? "opacity-40"
                : step === "step2"
                  ? "opacity-70"
                  : step === "step3"
                    ? "opacity-100"
                    : "opacity-100 bg-green w-8 rounded-full"
            }`}
            src={
              step !== "step1" && step !== "step2" && step !== "step3"
                ? check
                : uncheck
            }
            alt=""
          />
          <img
            className={` ${
              step === "step1"
                ? "opacity-20"
                : step === "step2"
                  ? "opacity-40"
                  : step === "step3"
                    ? "opacity-70 gradient-mask-r-0"
                    : "opacity-100 "
            }`}
            src={link}
            alt=""
          />
          <img
            className={`${
              step === "step1"
                ? "opacity-20"
                : step === "step2"
                  ? "opacity-40"
                  : step === "step3"
                    ? "opacity-70"
                    : "opacity-100"
            }`}
            src={uncheck}
            alt=""
          />
        </div>
        <div className="flex flex-col justify-center items-center w-full h-full">
          <form className="flex flex-col w-2/3 gap-4 h-full" action="submit">
            <h2 className="font-main text-2xl font-semibold t-[#253D4E]">
              {step === "step1"
                ? "Endereço de entrega"
                : step === "step2"
                  ? "Ir paga Pagamento"
                  : step === "step3"
                    ? "Resumo"
                    : ""}
            </h2>
            {step === "step1" && (
              <div className="flex flex-col h-full gap-4">
                {!adressUser ? (
                  <>
                    <DotLoader color="#000" />
                  </>
                ) : (
                  <>
                    <Input
                      className={"w-1/3"}
                      label="Cep"
                      placeholder="cep"
                      value={adressUser.zip_code}
                      disabled={true}
                    />
                    <div className="flex gap-6">
                      <Input
                        className={"w-2/3"}
                        label="Endereço"
                        placeholder="Endereço"
                        value={`${adressUser.line_1.split(",")[1]}, ${
                          adressUser.line_1.split(",")[0]
                        } - ${adressUser.line_1.split(",")[2]}`}
                        disabled={true}
                      />
                      <Input
                        className={"w-1/3"}
                        label="Complemento"
                        placeholder="Complemento"
                        value={adressUser.line_2}
                        disabled={true}
                      />
                    </div>
                    <div className="flex gap-6">
                      <Input
                        className={"w-2/3"}
                        label="Cidade"
                        placeholder="Cidade"
                        value={adressUser.city}
                        disabled={true}
                      />
                      <Input
                        className={"w-1/3"}
                        label="Estado"
                        placeholder="Estado"
                        value={adressUser.state}
                        disabled={true}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="cursor-pointer">
                        <input
                          className="cursor-pointer"
                          type="radio"
                          name="shippingOption"
                          value="Sedex"
                          checked={selectedOption === "Sedex"}
                          onChange={(e) => {
                            setSelectedOption(e.target.value);
                          }}
                        />
                        Envio por Sedex
                      </label>

                      <label className="cursor-pointer">
                        <input
                          className="cursor-pointer"
                          type="radio"
                          name="shippingOption"
                          value="PAC"
                          checked={selectedOption === "PAC"}
                          onChange={(e) => {
                            setSelectedOption(e.target.value);
                          }}
                        />
                        Envio por PAC
                      </label>
                    </div>
                  </>
                )}
              </div>
            )}
            {step === "step2" && (
              <div className="flex flex-col h-full">
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <h2 className="font-main text-2xl font-semibold t-[#253D4E]">
                    Clique no botão abaixo para realiza o pagamento
                  </h2>
                  <Button
                    onClick={createOrder}
                    type="button"
                    text="Pagar"
                    className="bg-green w-56 py-5 px-10 rounded-r-3xl rounded-bl-3xl text-2xl"
                  />
                </div>
              </div>
            )}
            {step === "step3" && (
              <div className="flex flex-col w-full h-full">
                <div className="flex w-full">
                  <div className="flex w-full gap-5">
                    <img className="w-10" src={pointer} alt="icon pointer" />
                    <div>
                      <h2 className="font-main text-base font-semibold t-[#253D4E]">{`${adressUser.city}, ${adressUser.state}`}</h2>
                      <h2 className="font-main text-base font-semibold t-[#253D4E]">{`${
                        adressUser.line_1
                      }${
                        adressUser.line_2 ? `-${adressUser.line_2}` : ""
                      }`}</h2>
                      <h2 className="font-main text-base font-semibold t-[#253D4E]">{`${adressUser.zip_code.slice(
                        0,
                        5
                      )}-${adressUser.zip_code.slice(6)}`}</h2>
                    </div>
                  </div>
                  <div className="flex w-2/4 gap-5">
                    <img className="w-10" src={truck} alt="img truck" />
                    <div className="flex flex-col font-main text-base font-medium">
                      <h2 className="font-main text-base font-semibold t-[#253D4E]">{`${selectedOption}`}</h2>
                      <h2 className="font-main text-base font-semibold t-[#253D4E]">
                        {selectedOption === "Sedex"
                          ? `R$ ${(sedex.price * 1.2).toLocaleString("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            })}`
                          : (pac.price * 1.2).toLocaleString("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            })}
                      </h2>
                    </div>
                  </div>
                </div>
                <div>
                  <div></div>
                </div>
              </div>
            )}
            {step === "step4" && (
              <div>
                <h2 className="font-main text-2xl font-semibold t-[#253D4E]">
                  {`Parabens ${userInfo.user.name}!!!`}{" "}
                </h2>
                <h2>
                  Sua compra foi realizada com sucesso. Agora é so esperar que
                  sua compra vai chegar rapidinho no seu endereço.
                </h2>
              </div>
            )}
            <div className="flex justify-center">
              <Button
                disabled={!paymentOk && step === "step2" ? true : false}
                onClick={handleChangeStep}
                className={`${
                  !paymentOk && step === "step2" ? "bg-gray-400" : "bg-black"
                } w-56 py-5 px-10 rounded-r-3xl rounded-bl-3xl text-2xl transition-all ease-in-out duration-500 ${
                  !paymentOk && step === "step2" ? "cursor-not-allowed" : ""
                }`}
                type={step !== "step4" ? "button" : "submit"}
                text={step !== "step4" ? "Próximo" : "Finalizar"}
              />
            </div>
          </form>
        </div>
      </div>
      {checkout && (
        <div className="flex fixed z-50 left-0 top-0 w-full h-full bg-bgModal">
          <div className="flex flex-col justify-end absolute bg-white p-5 w-4/5 h-[90%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg overflow-y-auto z-50">
            <div
              onClick={() => {
                setCheckout(false), verifyPayment();
              }}
              className="absolute top-0 right-2 flex items-center cursor-pointer"
            >
              <h2>Ao finalizar o pagamento, clique aqui para fechar </h2>
              <span className=" text-5xl text-[#000] cursor-pointer self-end hover:text-[#555]">
                &times;
              </span>
            </div>
            <iframe
              className="z-50 w-full h-[95%]"
              src={urlCheckout}
              title="Payment"
            ></iframe>
          </div>
        </div>
      )}
    </main>
  );
}
