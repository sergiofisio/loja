import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../Service/api";
import leaf from "../../assets/home/leaf-mini.svg";
import success from "../../assets/success-icon.svg";
import { toastFail, toastSuccess } from "../../context/toast";
import { validateInputs } from "../../functions/errorTreatment";
import Button from "../button";
import Input from "../input/form/input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FormProps } from "../../interfaces/interface";

const initialUserState = {
  name: "",
  email: "",
  document: "",
  phone: "",
  password: "",
  confPassword: "",
  admin: false,
};

const Form = ({ type, setType, setAdmin }: FormProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(initialUserState);
  const [step, setStep] = useState(1);
  const [confirmation, setConfirmation] = useState(1);

  console.log({ user });

  const handleLogin = async () => {
    if (!user.email || !user.password) {
      toastFail("Todos os campos são obrigatórios");
      return;
    }
    try {
      const {
        data: { user: loggedInUser, token },
      } = await axios.post("/login", user);
      if (!loggedInUser.admin) {
        toastFail("Você não tem permissão para acessar esta página.");
        return;
      }

      setUser({ ...user, admin: loggedInUser.admin });
      localStorage.setItem("token", token);
      localStorage.setItem("usuarioId", loggedInUser.id);
      localStorage.setItem("usuarioNome", loggedInUser.name);
      toastSuccess(
        `Bem vindo, ${await AsyncStorage.getItem("usuarioNome")}`,
        5000,
        "top-left"
      );
      setTimeout(() => {
        navigate("/home");
        setAdmin(loggedInUser.admin);
      }, 5000);
    } catch (error: any) {
      toastFail(error.response.data.error);
    }
  };

  const handleRegister = async () => {
    if (step === 1) {
      if (!user.name || user.name.length < 3) {
        toastFail("O campo nome deve ter mais que 3 caracteres");
        return;
      }

      if (await validateInputs("email", user.email)) {
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!user.phone || user.phone.length < 15 || !user.document) {
        toastFail(
          "Todos os campos são obrigatórios e devem ser preenchidos corretamente"
        );
        return;
      }
      if (
        await validateInputs("document", user.document.replace(/[.-]/g, ""))
      ) {
        return; // Error message is handled inside validateInputs
      }
      // setStep(3);
    } else if (step === 3) {
      if (!user.password || user.password !== user.confPassword) {
        toastFail("Os campos Senha e Confirmar Senha devem ser iguais");
        return;
      }
      try {
        await axios.post("/register", {
          name: user.name.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
            letter.toUpperCase()
          ),
          email: user.email,
          document: user.document,
          phone: user.phone.replace(/[()\s-]/g, ""),
          password: user.password,
        });
        setStep(4);
        setTimeout(() => setConfirmation(2), 1000);
        setTimeout(() => setConfirmation(3), 2000);
        setTimeout(() => navigate("/login"), 3000);
      } catch (error: any) {
        toastFail(error.response.data.error);
      }
    }
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "login") {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  const handleChangeForm = (typeForm: string) => {
    setType(typeForm);
    navigate(`/${typeForm}`);
  };

  const renderForm = () => (
    <>
      <Input
        password={step === 3 || type === "login"}
        type={type === "login" ? "email" : "text"}
        placeholder={
          type === "login"
            ? "email@email.com"
            : step === 2
            ? "Telefone"
            : "Digite seu nome"
        }
        label={type === "login" ? "E-mail" : step === 2 ? "Telefone" : "Nome"}
        set={(e) =>
          setUser({
            ...user,
            [type === "login"
              ? "email"
              : step === 1
              ? "name"
              : step === 2
              ? "phone"
              : "password"]: e.target.value,
          })
        }
        value={
          user[
            type === "login"
              ? "email"
              : step === 1
              ? "name"
              : step === 2
              ? "phone"
              : "password"
          ]
        }
        required={true}
      />
      <Input
        password={type === "login" || step === 3}
        placeholder={
          type === "login"
            ? "******"
            : step === 2
            ? "Digite seu CPF"
            : "Digite seu email"
        }
        type={type === "login" ? "password" : "text"}
        label={type === "login" ? "Senha" : step === 2 ? "CPF" : "E-mail"}
        set={(e) =>
          setUser({
            ...user,
            [type === "login"
              ? "password"
              : step === 1
              ? "email"
              : step === 2
              ? "document"
              : "confPassword"]: e.target.value,
          })
        }
        value={
          user[
            type === "login"
              ? "password"
              : step === 1
              ? "email"
              : step === 2
              ? "document"
              : "confPassword"
          ]
        }
        required={true}
      />
      <div className="flex items-center justify-center w-full gap-4">
        {type !== "login" && step !== 1 && (
          <Button
            onClick={() => setStep((prevStep) => prevStep - 1)}
            type="button"
            className="bg-green h-16 rounded-r-2xl rounded-bl-3xl w-1/3 self-center"
            text={"Voltar"}
          />
        )}
        <Button
          onClick={handleNext}
          type="submit"
          className="bg-green h-16 rounded-r-2xl rounded-bl-3xl w-1/3 self-center"
          text={type === "login" ? "Entrar" : "Próximo"}
        />
      </div>
    </>
  );

  const renderConfirmation = () => (
    <>
      {confirmation === 3 && (
        <img className="h-24" src={success} alt="icon Sucesso" />
      )}
      <h2
        className={`text-green font-main text-5xl font-bold ${
          confirmation === 2 ? "opacity-0" : "opacity-100"
        }`}
      >
        {confirmation === 3 ? "Bem Vindo!" : "Recebendo dados..."}
      </h2>
      {confirmation === 3 && (
        <p className="font-main text-2xl font-normal text-white">
          Cadastro realizado com sucesso, você será redirecionado para a página
          de login em 5 segundos.
          <span>
            {" "}
            Caso isso não ocorra{" "}
            <a className="text-green" onClick={() => navigate("/login")}>
              clique aqui
            </a>
          </span>
        </p>
      )}
    </>
  );

  return (
    <div className="flex flex-col justify-evenly items-center w-[50%] h-[60%] px-8 py-4 bg-[#2f2d2d] rounded-r-xl rounded-bl-xl relative">
      <img
        className={`absolute top-0 rotate-12 w-16 transition-all ${
          type === "login"
            ? "w-24 left-[90%] top-[-10%] rotate-[20deg]"
            : "left-[-10%]"
        }`}
        src={leaf}
        alt="img folha"
      />
      {step !== 4 ? (
        <>
          <h2 className="text-green font-main text-5xl font-bold ">
            {type === "login" ? "Entrar" : "Cadastrar"}
          </h2>
          <form
            action="submit"
            className="flex flex-col w-full h-[inherit] gap-[10%]"
          >
            {renderForm()}
          </form>
          <h3 className="flex gap-3 text-white text-center font-main text-base font-normal">
            {type === "login" ? "Não possui conta?" : "Já possui cadastro?"}{" "}
            <span
              onClick={() =>
                handleChangeForm(type === "login" ? "register" : "login")
              }
              className="text-green font-main font-semibold text-base cursor-pointer"
            >
              {type === "login" ? "Cadastre-se aqui." : "Clique aqui"}
            </span>
          </h3>
        </>
      ) : (
        renderConfirmation()
      )}
    </div>
  );
};

export default Form;
