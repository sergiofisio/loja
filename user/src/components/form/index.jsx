import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../Service/api";
import leaf from "../../assets/home/leaf-mini.svg";
import { toastFail, toastSuccess } from "../../context/toast";
import { validadeInputs } from "../../functions/errorTreatment";
import Button from "../button";
import Input from "../input/form/input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { validate } from "gerador-validador-cpf";

export default function Form({ login, setLogin, setSingIn }) {
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
  const [confirmacao, setConfirmacao] = useState(false);

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (login) {
      navigate("/register");
      setLogin(false);
      return setSingIn(true);
    }
    navigate("/login");
    setLogin(true);
    return setSingIn(false);
  }

  async function handleLogin() {
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
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("usuarioId", loggedInUser.id);
      await AsyncStorage.setItem("usuarioNome", loggedInUser.name);
      toastSuccess(
        `Bem vindo, ${await AsyncStorage.getItem("usuarioNome")}`,
        3000,
        "top-left"
      );
      setTimeout(() => {
        navigate("/home");
      }, 5000);
      return;
    } catch (error) {
      console.error(error);
      return toastFail(error.response.data.error);
    }
  }

  async function handleStep1() {
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

  async function handleStep2() {
    if (!user.phone) {
      return toastFail("O campo telefone é obrigatório");
    }
    if (user.phone.length < 15) {
      return toastFail("Está faltando alguma coisa no seu telefone");
    }

    if (!user.document) {
      return toastFail("O campo CPF é obrigatório");
    }

    const validateCpf = validate(user.document.replace(/[.-]/g, ""));

    if (!validateCpf) {
      return toastFail("CPF inválido");
    }

    if (await validadeInputs("document", user.document.replace(/[.-]/g, ""))) {
      return toastFail("Ja existe um cadastro com este CPF cadastrado");
    }
    setFirstInput("Senha");
    setFirstPlaceholder("Digite sua senha");
    setSecondInput("Confirmar Senha");
    setSecondPlaceholder("Confirme sua senha");
    setStep("step3");
    return;
  }

  async function handleRegistration() {
    if (!user.password) {
      return toastFail("O campo Senha é obrigatório");
    }
    if (user.password !== user.confPassword) {
      return toastFail("Os campos Senha e Confirmar Senha deve sem iguais");
    }
    setConfirmacao(true);
    try {
      await axios.post("/register", {
        name: user.name.replace(/(^\w{1})|(\s+\w{1})/g, (letra) =>
          letra.toUpperCase()
        ),
        email: user.email,
        document: user.document.replace(/[.-]/g, ""),
        phone: user.phone.replace(/[()\s-]/g, ""),
        password: user.password,
      });
      toastSuccess(
        `Seu cadastro foi realizado com sucesso, você sera redirecionado para o login`,
        3000,
        "top-left"
      );
      setTimeout(() => {
        navigate("/login");
        setConfirmacao(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      if (error.response.data.hasOwnProperty("senha")) {
        toastFail(error.response.data.senha, 5000);
      }
    }
  }

  async function handleNext(e) {
    e.preventDefault();
    e.stopPropagation();
    if (login) {
      await handleLogin();
    } else if (step === "step1") {
      await handleStep1();
    } else if (step === "step2") {
      await handleStep2();
    } else {
      await handleRegistration();
    }
  }

  return (
    <div className="flex flex-col justify-evenly items-center w-[70%] h-[60%] px-8 py-4 bg-[#2f2d2d] rounded-r-xl rounded-bl-xl relative md:w-full md:h-full">
      <img
        className={`absolute top-0 rotate-12 w-16 transition-all ${
          !login ? "w-24 left-[90%] top-[-10%] rotate-[20deg]" : "left-[-10%]"
        } md:hidden`}
        src={leaf}
        alt="img folha"
      />
      <h2 className="text-green font-main text-5xl font-bold ">
        {login ? "Entrar" : "Cadastrar"}
      </h2>
      <div className=" flex flex-col w-full h-[inherit] gap-[10%] md:justify-center">
        <Input
          password={step === "step3" ? true : false}
          type={login ? "email" : "text"}
          placeholder={login ? "email@email.com" : firstPlaceholder}
          label={login ? "E-mail" : firstInput}
          set={(e) => {
            login
              ? setUser({ ...user, email: e.target.value })
              : step === "step1"
                ? setUser({ ...user, name: e.target.value })
                : step === "step2"
                  ? setUser({ ...user, phone: e.target.value })
                  : setUser({ ...user, password: e.target.value });
          }}
          value={
            login
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
          password={login || step === "step3" ? true : false}
          placeholder={login ? "******" : SecondPlaceholder}
          type={login ? "password" : step === "step1" ? "email" : "text"}
          label={login ? "Senha" : secondInput}
          set={(e) => {
            login
              ? setUser({ ...user, password: e.target.value })
              : step === "step1"
                ? setUser({ ...user, email: e.target.value })
                : step === "step2"
                  ? setUser({ ...user, document: e.target.value })
                  : setUser({ ...user, confPassword: e.target.value });
          }}
          value={
            login
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
        className={`h-16 rounded-r-2xl rounded-bl-3xl ${
          confirmacao
            ? "cursor-not-allowed bg-gray-400"
            : "cursor-pointer bg-green"
        }`}
        text={login ? "Entrar" : "Próximo"}
        disabled={confirmacao}
      />
      <h3 className="flex gap-3 text-white text-center font-main text-base font-normal">
        {login ? "Não possui conta?" : "Ja possui cadastro?"}{" "}
        <span
          onClick={(e) => handleClick(e)}
          className="text-green font-main font-semibold text-base cursor-pointer"
        >
          {login ? "Cadastre-se aqui." : "Clique aqui"}
        </span>
      </h3>
    </div>
  );
}
