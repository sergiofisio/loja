import { validate } from "gerador-validador-cpf";
import axios from "../Service/api";
import { toastFail } from "../context/toast";

export async function validateInputs(input: string, data: string) {
  if (!data) {
    return toastFail(`Faltou preencher o ${input}`);
  }
  if (input === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data)) {
      toastFail("O E-mail é inválido!");
      return "emailInvalid";
    }
  }
  if (input === "document") {
    const verifyCPF = validate(data);
    if (!verifyCPF) {
      toastFail("O CPF digitado é inválido!");
      return "cpfInvalid";
    }
  }

  try {
    const {
      data: { validate, message },
    } = await axios.post("/verify", {
      input,
      value: data,
    });

    if (validate) throw new Error(message);

    return validate;
  } catch (error: any) {
    toastFail(error.message);
    return;
  }
}

export function verifyInputs(inputs: any) {
  for (const input in inputs) {
    if (!inputs[input]) {
      toastFail(`O campo ${input} é obrigatório!`);
      return true;
    }
  }
  return false;
}
