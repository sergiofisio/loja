import AsyncStorage from "@react-native-async-storage/async-storage";
import { localconfig } from "../../../utils/localConfig";
import { useState } from "react";
import moment from "moment";
import Button from "../../button";
import axios from "../../../Service/api";

export default function Step2({
  adressUser,
  paymentOk,
  step,
  selectedOption,
  userInfo,
  freteValue,
  value,
  cupom,
  setState,
}) {
  const [id_parceiro, setId_parceiro] = useState(null);
  const [code, setCode] = useState("");

  async function createOrder(e) {
    e.preventDefault();
    e.stopPropagation();
    let frete = "";
    if (selectedOption === "Sedex") {
      frete = freteValue.sedex.price;
    } else {
      frete = freteValue.pac.price;
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
          items: JSON.parse(await AsyncStorage.getItem("cart")),
          recipient_name: userInfo.name,
          recipient_phone: userInfo.phones.mobile_phone,
          email: userInfo.email,
          frete,
          amount: Math.round(Number(value) * 100 + frete),
          description: `Pedido de ${userInfo.name}`,
          data,
          compra: await AsyncStorage.getItem("cart"),
          cupom,
          installments: 10,
          id_parceiro,
          shippingType: selectedOption,
          code,
        },
        localconfig.getAuth(await AsyncStorage.getItem("token"))
      );
      setState((prevState) => ({
        ...prevState,
        urlCheckout: order.data.order.checkouts[0].payment_url,
        checkout: true,
        order: order.data.order,
      }));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h2 className="font-main text-2xl font-semibold t-[#253D4E]">
          Clique no botão abaixo para realiza o pagamento
        </h2>
        <Button
          disabled={paymentOk && step === "step2" ? true : false}
          onClick={createOrder}
          type="button"
          text="Pagar"
          className="bg-green w-56 py-5 px-10 rounded-r-3xl rounded-bl-3xl text-2xl"
        />
      </div>
    </div>
  );
}
