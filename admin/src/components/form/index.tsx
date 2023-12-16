import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../Service/api";
import leaf from "../../assets/home/leaf-mini.svg";
import success from "../../assets/success-icon.svg";
import { toastFail, toastSuccess } from "../../context/toast";
import { validadeInputs } from "../../functions/errorTreatment";
import Button from "../button";
import Input from "../input/form/input";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Form({
  type,
  setType,
  setAdmin,
}: {
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
  setAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    document: "",
    phone: "",
    password: "",
    confPassword: "",
    admin: false,
  });
  const [firstInput, setFirstInput] = useState("Nome");
  const [firstPlaceholder, setFirstPlaceholder] = useState("Digite seu nome");
  const [secondInput, setSecondInput] = useState("E-mail");
  const [SecondPlaceholder, setSecondPlaceholder] = useState("email@email.com");
  const [step, setStep] = useState("step1");
  const [confirmacao, setConfirmacao] = useState("step1");

  async function handleNext(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (type === "login") {
      if (!user.email || !user.password) {
        return toastFail("Todos os campos são obrigatórios");
      }
      try {
        const {
          data: { user: loggedInUser, token },
        } = await axios.post("/login", {
          email: user.email,
          password: user.password,
        });
        if (!loggedInUser.admin) {
          return toastFail("Você não tem permissão para acessar esta pagina.");
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
        return;
      } catch (error: any) {
        return toastFail(error.response.data.error);
      }
    }
    if (step === "step1") {
      if (!user.name) {
        return toastFail("Digite seu nome");
      }
      if (user.name.length < 3) {
        return toastFail("O campo nome deve ter mais que 3 caractéres");
      }

      if (await validadeInputs("email", user.email)) {
        return toastFail("Ja existe um cadastro com este e-mail cadastrado");
      }
      setFirstInput("Telefone");
      setFirstPlaceholder("Digite seu telefone");
      setSecondInput("Cpf");
      setSecondPlaceholder("Digite seu CPF");
      return setStep("step2");
    }
    if (step === "step2") {
      if (!user.phone) {
        return toastFail("O campo telefone é obrigatório");
      }
      if (user.phone.length < 15) {
        return toastFail("Está faltando alguma coisa no seu telefone");
      }

      if (!user.document) {
        return toastFail("O campo CPF é obrigatório");
      }

      if (
        await validadeInputs("document", user.document.replace(/[.-]/g, ""))
      ) {
        return toastFail("Ja existe um cadastro com este CPF cadastrado");
      }
      setFirstInput("Senha");
      setFirstPlaceholder("Digite sua senha");
      setSecondInput("Confirmar Senha");
      setSecondPlaceholder("Confirme sua senha");
      return setStep("step3");
    }
    if (!user.password) {
      return toastFail("O campo Senha é obrigatório");
    }
    if (user.password !== user.confPassword) {
      return toastFail("Os campos Senha e Confirmar Senha deve sem iguais");
    }
    try {
      await axios.post("/register", {
        name: user.name.replace(/(^\w{1})|(\s+\w{1})/g, (letra) =>
          letra.toUpperCase()
        ),
        email: user.email,
        document: user.document,
        phone: user.phone.replace(/[()\s-]/g, ""),
        password: user.password,
      });
      setStep("step4");
      setTimeout(() => {
        setConfirmacao("step2");
      }, 1000);
      setTimeout(() => {
        setConfirmacao("step3");
      }, 1000);
      setTimeout(() => {
        navigate("/login");
      });
    } catch (error: any) {
      if (error.response.data.hasOwnProperty("senha")) {
        toastFail(error.response.data.senha, 5000);
      }
    }
  }

  function handleChangeForm(typeForm: string) {
    setType(typeForm);
    navigate(`/${typeForm}`);
  }

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
      {step !== "step4" ? (
        <>
          <h2 className="text-green font-main text-5xl font-bold ">
            {type === "login" ? "Entrar" : "Cadastrar"}
          </h2>
          <div className=" flex flex-col w-full h-[inherit] gap-[10%]">
            <Input
              password={step === "step3" ? true : false}
              type={type === "login" ? "email" : "text"}
              placeholder={
                type === "login" ? "email@email.com" : firstPlaceholder
              }
              label={type === "login" ? "E-mail" : firstInput}
              set={(e) => {
                type === "login"
                  ? setUser({ ...user, email: e.target.value })
                  : step === "step1"
                  ? setUser({ ...user, name: e.target.value })
                  : step === "step2"
                  ? setUser({ ...user, phone: e.target.value })
                  : setUser({ ...user, password: e.target.value });
              }}
              value={
                type === "login"
                  ? user.email
                  : step === "step1"
                  ? user.name
                  : step === "step2"
                  ? user.phone
                  : user.password
              }
              required={true}
            />
            <Input
              password={type === "login" || step === "step3" ? true : false}
              placeholder={type === "login" ? "******" : SecondPlaceholder}
              type={
                type === "login"
                  ? "password"
                  : step === "step1"
                  ? "email"
                  : "text"
              }
              label={type === "login" ? "Senha" : secondInput}
              set={(e) => {
                type === "login"
                  ? setUser({ ...user, password: e.target.value })
                  : step === "step1"
                  ? setUser({ ...user, email: e.target.value })
                  : step === "step2"
                  ? setUser({ ...user, document: e.target.value })
                  : setUser({ ...user, confPassword: e.target.value });
              }}
              value={
                type === "login"
                  ? user.password
                  : step === "step1"
                  ? user.email
                  : step === "step2"
                  ? user.document
                  : user.confPassword
              }
              required={true}
            />
          </div>
          <Button
            onClick={(e) => handleNext(e)}
            type="submit"
            className="bg-green h-16 rounded-r-2xl rounded-bl-3xl"
            text={type === "login" ? "Entrar" : "Próximo"}
          />
          <h3 className="flex gap-3 text-white text-center font-main text-base font-normal">
            {type === "login" ? "Não possui conta?" : "Ja possui cadastro?"}{" "}
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
        <>
          {confirmacao === "step3" ? (
            <img className="h-24" src={success} alt="icon Sucesso" />
          ) : (
            ""
          )}
          <h2
            className={`text-green font-main text-5xl font-bold opacity-100 duration-1000 transition-all ${
              confirmacao === "step2"
                ? "opacity-0"
                : confirmacao === "step3"
                ? "opacity-100"
                : ""
            }`}
          >
            {confirmacao === "step1"
              ? "Recebendo dados..."
              : confirmacao === "step3"
              ? "Bem Vindo!"
              : "Recebendo dados..."}
          </h2>
          {confirmacao === "step3" ? (
            <p className="font-main text-2xl font-normal text-white flex flex-col">
              Cadastro realizado com sucesso, você será redirecionado para a
              pagina de login em 5 segundos.{" "}
              <span>
                {" "}
                Caso isso não ocorra{" "}
                <a className="text-green" onClick={() => navigate("/login")}>
                  clique aqui
                </a>
              </span>
            </p>
          ) : (
            ""
          )}
        </>
      )}
    </div>
  );
}
