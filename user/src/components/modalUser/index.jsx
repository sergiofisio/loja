import Input from "../input/form/input";
import closeBtn from "../../assets/closeBtn.svg";
import { removeSpecialChars } from "../../functions/functions";
import Button from "../button";
import { toastFail, toastSuccess } from "../../context/toast";
import axiosPrivate from "../../Service/api";

export default function ModalUser({
  nome,
  setNome,
  email,
  cpf,
  telefone,
  setTelefone,
  senha,
  setSenha,
  confSenha,
  setConfSenha,
  setFoto,
  setShowModal,
}) {
  async function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    const options = {
      id: localStorage.getItem("usuarioId"),
      nome,
      email,
      cpf,
      telefone,
    };
    try {
      if (senha) {
        if (senha !== confSenha) {
          return toastFail("Os campos Senha e Confirmar Senha deve sem iguais");
        }
        options.senha = senha;
      }
      const response = await axiosPrivate.patch("/update", options);

      toastSuccess(response.data.mensagem, 3000, "top-center");
      setTimeout(() => {
        setShowModal("");
      }, 3000);
    } catch (error) {
      console.log(error);
      if (error.response.data.hasOwnProperty("senha")) {
        toastFail(error.response.data.senha, 5000);
      }
    }
  }
  return (
    <div className="flex flex-col justify-center items-center bg-bgModal absolute top-0 w-full h-full">
      <div
        className={`relative flex flex-col justify-evenly w-1/3 h-3/5 1536:h-[90%] 1440:h-2/3 1366:h-[90%] bg-white rounded-3xl p-8`}
      >
        <img
          onClick={() => {
            setShowModal(""), setFoto("");
          }}
          className="absolute top-3 right-3 cursor-pointer 1366:border-black p-[0.1rem] border-[1px] rounded-full border-solid"
          src={closeBtn}
          alt="btnClose"
        />
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            label="Nome"
            placeholder="Digite seu nome"
            type="text"
            set={setNome}
            value={nome}
          />
          <Input label="E-mail" type="email" value={email} disabled={true} />
          <div className="flex gap-8">
            <Input label="Cpf" type="string" value={cpf} disabled={true} />
            <Input
              label="Telefone"
              type="string"
              set={setTelefone}
              value={telefone}
            />
          </div>
          <Input
            password={true}
            label="Senha"
            placeholder="Digite a senha se quiser muda-la"
            type="password"
            set={setSenha}
            value={senha}
          />
          <Input
            password={true}
            label="Confirmar Senha"
            placeholder="Confirme sua senha"
            type="password"
            set={setConfSenha}
            value={confSenha}
          />
          <div className="flex items-center justify-center">
            <Button
              onClick={e => handleSubmit(e)}
              type="submit"
              className="bg-green w-40 h-14 rounded-3xl"
              text="Enviar"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
