import { useCallback, useEffect, useMemo, useState } from "react";

import axios from "../../Service/api";

import img from "../../assets/cart/img.svg";
import img2 from "../../assets/cart/img2.svg";
import img3 from "../../assets/cart/img3.svg";
import img4 from "../../assets/cart/img4.svg";
import Button from "../../components/button";

import { toastFail, toastSuccess } from "../../context/toast";

import { useNavigate } from "react-router-dom";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DotLoader } from "react-spinners";
import InfoCart from "../../components/infoCart";
import ChangeStep from "../../components/steps/changeStep";
import Step1 from "../../components/steps/step1";
import Step2 from "../../components/steps/step2";
import Step3 from "../../components/steps/step3";
import Step4 from "../../components/steps/step4";
import Checkout from "../../components/checkout";

export default function Cart() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    cart: [],
    userInfo: "",
    freteValue: "",
    adressUser: "",
    value: 0,
    weigth: 0,
    step: "step1",
    selectedOption: "Sedex",
    cupom: "",
    paymentOk: false,
    order: "",
    checkout: "",
    urlCheckout: "",
    allProducts: [],
    init: false,
    discount: false,
  });

  console.log({ state });

  const loadCartData = useCallback(async () => {
    const cart = await AsyncStorage.getItem("cart");
    setState((prevState) => ({ ...prevState, cart: JSON.parse(cart) }));
  }, []);

  useEffect(() => {
    loadCartData();
  }, [loadCartData]);

  const { weight, sum } = useMemo(() => {
    let weight = 0;
    let sum = 0;

    if (state.cart) {
      for (const product of state.cart) {
        weight += Number(product.product.peso) * product.quantidade;
        sum += Number(product.product.preco) * product.quantidade;
      }
    }

    return { weight, sum };
  }, [state.cart]);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      value: sum / 100,
      weigth: weight,
    }));
  }, [weight, sum]);
  async function getFrete() {
    try {
      const [cart, usuarioId, token] = await Promise.all([
        AsyncStorage.getItem("cart").then(JSON.parse),
        AsyncStorage.getItem("usuarioId"),
        AsyncStorage.getItem("token"),
      ]);

      const {
        data: { user, adresses },
      } = await axios.get(`/infoUser/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setState((prevState) => ({
        ...prevState,
        userInfo: user,
        adressUser: adresses[0],
      }));

      const amount =
        cart.reduce(
          (total, item) => total + item.product.preco * item.quantidade,
          0
        ) / 100;
      const {
        data: { code, prices },
      } = await axios.post(
        `/frete/${adresses[0].zip_code.replace("-", "")}`,
        {
          amount,
          cart,
          document: user.document,
          name: user.name,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const freteData = prices.reduce((acc, frete) => {
        if (frete.service_type === "PAC" || frete.service_type === "SEDEX") {
          let date = new Date();
          date.setDate(date.getDate() + frete.delivery_time + 2);
          acc[frete.service_type.toLowerCase()] = {
            date: date.toLocaleDateString("pt-BR"),
            price: frete.price * 1.1,
          };
        }
        return acc;
      }, {});

      setState((prevState) => ({
        ...prevState,
        freteValue: freteData,
      }));
    } catch (error) {
      console.log(error);
    }
  }
  async function handleChangeStep(e, type) {
    e.preventDefault();
    e.stopPropagation();

    const steps = ["step1", "step2", "step3", "step4"];
    const currentStepIndex = steps.indexOf(state.step);

    if (type === "prev" && currentStepIndex > 0) {
      setState((prevState) => ({
        ...prevState,
        step: steps[currentStepIndex - 1],
      }));
      return;
    }

    if (state.step === "step1") {
      const options = {
        Sedex: {
          error: state.freteValue.sedex.error,
          message: "Sedex indisponível",
        },
        PAC: { error: state.freteValue.pac.error, message: "PAC indisponível" },
      };

      if (options[state.selectedOption]?.error) {
        return toastFail(options[state.selectedOption].message);
      }

      const cart = JSON.parse(await AsyncStorage.getItem("cart"));
      if (cart.some((product) => !product.quantidade)) {
        return toastFail(
          "Há algum produto que esta com quantidade 0. Verifique por favor!!"
        );
      }
    }

    if (state.step === "step4") {
      await AsyncStorage.removeItem("cart");
      await axios.patch(
        `/finishOrder/${state.order.id}`,
        { email: state.userInfo.email },
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
      return;
    }

    if (currentStepIndex < steps.length - 1) {
      setState((prevState) => ({
        ...prevState,
        step: steps[currentStepIndex + 1],
      }));
    }
  }
  async function auth() {
    try {
      await axios.get("/verifyToken", {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      console.log(error);
      if (error.response.status === 401 || error.response.status === 408) {
        toastFail("Sua sessão expirou!");
        return setTimeout(() => {
          AsyncStorage.clear();
          navigate("/");
        }, 4000);
      }
    }
  }
  async function products() {
    try {
      const {
        data: { products },
      } = await axios.get("/infoHome/false", {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      });
      setState((prevState) => ({ ...prevState, allProducts: products }));
    } catch (error) {
      toastFail(error.response.data.error, 3000);
    }
  }
  async function handleCupom(e) {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!state.cupom)
        throw new Error("Se tiver um cupom de desconto, preencha o campo");
      if (state.discount)
        throw new Error("Você so pode usar um cupom de desconto");
      const { data } = await axios.get(`/cupom/${state.cupom.toLowerCase()}`, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      });
      if (data.cupom) {
        setState((prevState) => ({ ...prevState, discount: data.cupom }));
        return setState((prevState) => ({
          ...prevState,
          value: (state.value * 0.9).toFixed(2),
        }));
      }
    } catch (error) {
      if (error.response) return toastFail(error.response.data.error, 3000);
      else toastFail(error.message, 3000);
    }
  }

  function valueCartProducts(discount) {
    let value = 0;
    for (const product of state.cart) {
      value += product.product.preco * product.quantidade;
    }
    if (discount) {
      return (value * 0.9) / 100;
    }
    return value / 100;
  }

  const verifyCart = useCallback(async () => {
    try {
      const cartItem = await AsyncStorage.getItem("cart");
      if (!cartItem) {
        navigate("/home");
        return;
      }
      setState((prevState) => ({ ...prevState, cart: JSON.parse(cartItem) }));
      await Promise.all([getFrete(), products(), auth()]);
      setState((prevState) => ({ ...prevState, init: true }));
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  }, [navigate, getFrete, products, auth]);

  useEffect(() => {
    verifyCart();
  }, []);

  return (
    <main className="relative flex justify-center w-full min-h-[calc(100vh-6rem)] p-9 md:flex-col md:p-1">
      {!state.init ? (
        <DotLoader color="#3bb77e" />
      ) : (
        <>
          <img
            className="absolute bottom-0 right-0 md:hidden"
            src={
              {
                step1: img,
                step2: img2,
                step3: img3,
                step4: img4,
              }[state.step]
            }
            alt="img"
          />
          <InfoCart
            allProducts={state.allProducts}
            cart={state.cart}
            setState={setState}
            handleCupom={handleCupom}
            frete={state.freteValue}
            valueCartProducts={valueCartProducts(state.discount)}
          />
          <div className="flex flex-col items-start w-2/3 min-h-full p-8 gap-12 md:w-full md:p-1">
            <ChangeStep step={state.step} />
            <div className="flex flex-col justify-center items-center w-full h-full">
              <form
                className="flex flex-col w-2/3 gap-4 h-full md:w-full"
                action="submit"
              >
                <h2 className="font-main text-2xl font-semibold t-[#253D4E]">
                  {
                    {
                      step1: "Endereço de entrega",
                      step2: "Ir paga Pagamento",
                      step3: "Resumo",
                      step4: "",
                    }[state.step]
                  }
                </h2>
                {
                  {
                    step1: (
                      <Step1
                        adressUser={state.adressUser}
                        setState={setState}
                        selectedOption={state.selectedOption}
                      />
                    ),
                    step2: (
                      <Step2
                        adressUser={state.adressUser}
                        paymentOk={state.paymentOk}
                        step={state.step}
                        selectedOption={state.selectedOption}
                        userInfo={state.userInfo}
                        freteValue={state.freteValue}
                        value={state.value}
                        cupom={state.cupom}
                        setState={setState}
                      />
                    ),
                    step3: (
                      <Step3
                        adressUser={state.adressUser}
                        selectedOption={state.selectedOption}
                        freteValue={state.freteValue}
                      />
                    ),
                    step4: <Step4 userInfo={state.userInfo} />,
                  }[state.step]
                }
                <div className="flex justify-center gap-3">
                  {state.step === "step2" && (
                    <Button
                      onClick={(e) => handleChangeStep(e, "prev")}
                      className={`bg-black w-56 py-5 px-10 rounded-r-3xl rounded-bl-3xl text-2xl transition-all ease-in-out duration-500`}
                      type={"button"}
                      text="voltar"
                    />
                  )}
                  <Button
                    disabled={
                      !state.paymentOk && state.step === "step2" ? true : false
                    }
                    onClick={(e) => handleChangeStep(e, "next")}
                    className={`${
                      !state.paymentOk && state.step === "step2"
                        ? "bg-gray-400"
                        : "bg-black"
                    } w-56 py-5 px-10 rounded-r-3xl rounded-bl-3xl text-2xl transition-all ease-in-out duration-500 ${
                      !state.paymentOk && state.step === "step2"
                        ? "cursor-not-allowed"
                        : ""
                    }`}
                    type={state.step !== "step4" ? "button" : "submit"}
                    text={state.step !== "step4" ? "Próximo" : "Finalizar"}
                  />
                </div>
              </form>
            </div>
          </div>
          {state.checkout && (
            <Checkout
              setState={setState}
              urlCheckout={state.urlCheckout}
              order={state.order}
            />
          )}
        </>
      )}
    </main>
  );
}
