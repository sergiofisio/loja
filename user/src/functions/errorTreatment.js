import { validate } from "gerador-validador-cpf";
import axios from "../Service/api";
import { toastFail } from "../context/toast";

export async function validadeInputs(input, data) {
  if (!data) {
    return toastFail(`Faltou preencher o ${input}`);
  }
  if (input === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data)) {
      toastFail("O E-mail é inválido!");
      return false;
    }
  }
  if (input === "cpf") {
    const verifyCPF = validate(data);
    if (!verifyCPF) {
      toastFail("O CPF digitado é inválido!");
      return false;
    }
  }

  try {
    const verify = await axios.post("/verify", {
      input,
      value: data,
    });
    return verify.data;
  } catch ({
    response: {
      data: { send, mensagem },
    },
  }) {
    toastFail(mensagem);
    return send;
  }
}

export function verifyInputs(inputs) {
  for (const input in inputs) {
    if (!inputs[input]) {
      toastFail(`O campo ${input} é obrigatório!`);
      return true;
    }
  }
  return false;
}

export function verifyPassword(inputs) {
  for (const input in inputs) {
    if (!inputs[input]) {
      toastFail(`O campo ${input} é obrigatório!`, "toastWhite");
      return true;
    }
  }
  return false;
}
