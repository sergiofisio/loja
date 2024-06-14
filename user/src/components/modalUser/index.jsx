import Input from "../input/form/input";
import closeBtn from "../../assets/closeBtn.svg";
import Button from "../button";
import { toastFail, toastSuccess } from "../../context/toast";
import axios from "../../Service/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ModalUser({ user, setUser, setShowModal }) {
  async function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (user.password) {
        if (user.password !== user.confPassword) {
          return toastFail("Os campos Senha e Confirmar Senha deve sem iguais");
        }
      }
      const response = await axios.patch(`/updateUser/${user.id}`, user, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      });

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
    <div className="flex flex-col items-center bg-bgModal absolute top-0 w-full h-full z-50 p-10">
      <div
        className={`relative flex flex-col w-1/3 h-3/5 1536:h-[90%] 1440:h-2/3 1366:h-[90%] bg-white rounded-3xl p-8`}
      >
        <img
          onClick={() => {
            setShowModal(""), setFoto("");
          }}
          className="absolute top-3 right-3 cursor-pointer 1366:border-black p-[0.1rem] border-[1px] rounded-full border-solid"
          src={closeBtn}
          alt="btnClose"
        />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-between gap-3 h-full"
        >
          <div>
            <Input
              label="Nome"
              placeholder="Digite seu nome"
              type="text"
              set={(e) => setUser({ ...user, name: e.target.value })}
              value={user.name}
            />
            <Input
              label="E-mail"
              type="email"
              value={user.email}
              disabled={true}
            />
            <div className="flex gap-8">
              <Input
                label="Cpf"
                type="string"
                value={user.document}
                disabled={true}
              />
              <Input
                label="Telefone"
                type="string"
                set={(e) => setUser({ ...user, phone: e.target.value })}
                value={user.phone}
              />
            </div>
            <Input
              password={true}
              label="Senha"
              placeholder="Digite a senha se quiser muda-la"
              type="password"
              set={(e) => setUser({ ...user, password: e.target.value })}
              value={user.password}
            />
            <Input
              password={true}
              label="Confirmar Senha"
              placeholder="Confirme sua senha"
              type="password"
              set={(e) => setUser({ ...user, confPassword: e.target.value })}
              value={user.confPassword}
            />
          </div>
          <div className="flex items-center justify-center">
            <Button
              onClick={(e) => handleSubmit(e)}
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
