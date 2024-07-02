import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../Service/api";
import { toastFail, toastSuccess } from "../../context/toast";

export default function Checkout({ setState, urlCheckout, order }) {
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
      setState((prevState) => ({ ...prevState, paymentOk: true }));
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="flex fixed z-50 left-0 top-0 w-full h-full bg-bgModal">
      <div className="flex flex-col justify-end absolute bg-white p-5 w-4/5 h-[90%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg overflow-y-auto z-50">
        <div
          onClick={() => {
            setState((prevState) => ({ ...prevState, checkout: false })),
              verifyPayment();
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
  );
}
