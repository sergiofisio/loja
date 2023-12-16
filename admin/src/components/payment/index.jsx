import elo from "../../assets/payment/Elo.svg";
import master from "../../assets/payment/Mastercard.svg";
import paypal from "../../assets/payment/PayPal.svg";
import security from "../../assets/payment/Security.svg";
import visa from "../../assets/payment/Visa.svg";
import delivery from "../../assets/payment/delivery.svg";
import pix from "../../assets/payment/pix.svg";
import tag from "../../assets/payment/tag.svg";
import CardPayment from "../../components/cardPayment";

export default function Payment() {
  return (
    <section className="flex flex-col h-full mt-[5%] text-black text-center font-main text-5xl font-bold gap-4">
      <h1>Métodos de pagamento</h1>
      <div className="flex items-center justify-around h-full">
        <CardPayment
          img={tag}
          text="Melhores preços"
          paragraph="Melhores preços do mercado de remédios naturais."
        />
        <CardPayment
          img={security}
          text="Pagamento seguro"
          paragraph="Informações de pagamento criptografadas."
        />
        <CardPayment
          img={delivery}
          text="Entrega em todo Brasil"
          paragraph="Entregamos em todo território brasileiro."
        />
      </div>
      <div className="flex flex-wrap justify-center items-center self-center w-3/5 h-full gap-[3%]">
        <img
          className="w-1/4 h-2/5 p-4 rounded-3xl"
          src={visa}
          alt="img Visa"
        />
        <img
          className="w-1/4 h-2/5 p-4 rounded-3xl"
          src={master}
          alt="img MasterCard"
        />
        <img className="w-1/4 h-2/5 p-4 rounded-3xl" src={elo} alt="img Elo" />
        <img className="w-1/4 h-2/5 p-4 rounded-3xl" src={pix} alt="img Pix" />
      </div>
    </section>
  );
}
