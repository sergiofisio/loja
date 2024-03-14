import { useState } from "react";
import closeBtn from "../../assets/closeBtn.svg";
import Input from "../input/form/input";
import mail from "../../assets/mail.svg";
import phone from "../../assets/phone.svg";
import contact from "../../assets/contact.svg";
import SelectContact from "../input/selectContact";
import emailjs from "@emailjs/browser";
import Button from "../button";
import { toastFail, toastfy } from "../../context/toast";
import { verifyInputs } from "../../functions/errorTreatment";

export default function ModalContato({ setShowModalContato }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [assunto, setAssunto] = useState("");
  const [pedido, setPedido] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    if (
      verifyInputs({
        nome,
        email,
        telefone,
        assunto,
        mensagem,
      })
    ) {
      return;
    }

    try {
      await emailjs.send(
        import.meta.env.VITE_SMTP_EMAIL_SERVICE,
        import.meta.env.VITE_SMTP_EMAIL_TEMPLATE,
        {
          nome,
          email,
          telefone,
          assunto,
          pedido,
          mensagem,
        },
        import.meta.env.VITE_SMTP_EMAIL_PUBLIC_KEY
      );
      toastfy("success", "Email enviado com sucesso!", "bg-green", 3000);
      setNome("");
      setEmail("");
      setTelefone("");
      setAssunto("");
      setPedido("");
      setMensagem("");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center bg-bgModal fixed top-0 w-full h-full">
      <div className="relative flex justify-evenly w-2/3 h-2/3 1536:h-[90%] 1366:h-[90%] bg-white rounded-3xl p-8 shadow-green shadow-2xl">
        <img
          onClick={() => {
            setShowModalContato(false);
          }}
          className="absolute top-6 right-6 cursor-pointer"
          src={closeBtn}
          alt="btnClose"
        />
        <div className="flex flex-col justify-center w-1/3 font-main text-2xl gap-4">
          <img src={contact} alt="" />
          <h2>
            Tem alguma dúvida, sugestão ou problema com um pedido? Nos envie uma
            mensagem através do formulario ao lado.
          </h2>
          <div className="flex gap-4">
            <img
              className="border-2 border-green rounded-full w-8 h-8 p-1"
              src={phone}
              alt="icon phone"
            />
            <h2>{"(11)96593-2620"}</h2>
          </div>
          <div className="flex gap-4">
            <img
              className="border-2 border-green rounded-full w-8 h-8 p-1"
              src={mail}
              alt="icon phone"
            />
            <h2>{"storelifegreen@gmail.com"}</h2>
          </div>
        </div>
        <form
          className="flex flex-col justify-center w-2/4 gap-4 p-8"
          action="submit"
        >
          <Input
            className="!flex-row items-center"
            classnameLabel="w-1/3"
            label="Nome"
            type="text"
            placeholder="Digite seu nome"
            set={(e) => setNome(e.target.value)}
            value={nome}
            required={true}
          />
          <Input
            className="!flex-row items-center"
            classnameLabel="w-1/3"
            label="E-mail"
            type="email"
            placeholder="Digite seu email"
            set={(e) => setEmail(e.target.value)}
            value={email}
            required={true}
          />
          <Input
            className="!flex-row items-center"
            classnameLabel="w-1/3"
            label="Telefone"
            type="text"
            placeholder="Digite seu Telefone"
            set={(e) => setTelefone(e.target.value)}
            value={telefone}
            required={true}
          />
          <div className="flex gap-4">
            <div
              className={`flex flex-col gap-1 ${
                assunto === "Problema com pedido" ? "w-1/2" : "w-full"
              }`}
            >
              <label
                className="font-main  font-normal text-[#3bb77e]"
                htmlFor="Assunto"
              >
                Assunto
              </label>
              <SelectContact
                className="font-main font-normal text-black !rounded-xl !border-[#555555] !border-solid !border-2 h-12 w-full "
                setSelectInput={(e) => setAssunto(e)}
                selectInput={assunto}
              />
            </div>
            {assunto === "Problema com pedido" && (
              <Input
                className="w-1/2 "
                label="Pedido"
                type="text"
                placeholder="Codigo do pedido"
                set={(e) => setPedido(e.target.value)}
                value={pedido}
              />
            )}
          </div>
          <div>
            <label
              className="font-main font-normal text-[#3bb77e] 1536:text-xs 1440:text-xs 1366:text-xs"
              htmlFor="mensagem"
            >
              Mensagem
            </label>
            <textarea
              className="resize-none border-[#555555] border-solid border-2 rounded-xl w-full p-3"
              name="mensagem"
              onChange={(e) => {
                setMensagem(e.target.value);
              }}
              value={mensagem}
              cols="30"
              rows="8"
            ></textarea>
          </div>
          <Button
            onClick={(e) => {
              handleSubmit(e);
            }}
            className="bg-green !w-1/3 self-center h-24 rounded-r-2xl rounded-bl-3xl !text-xl"
            text="Enviar"
          />
        </form>
      </div>
    </div>
  );
}
