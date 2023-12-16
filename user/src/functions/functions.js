export function formatCpf(cpf) {
  cpf = cpf.replace(/\D/g, "");
  return cpf;
}

export function formatCep(cep) {
  cep = cep.replace(/\D/g, "");
  return cep;
}

export function formatPhone(phone) {
  phone = phone.replace(/\D/g, "");
  const formattedPhone = `(${phone.substr(0, 2)}) ${phone.substr(
    2,
    5
  )}-${phone.substr(7)}`;
  return formattedPhone;
}

export function sortByAverage({ data: { info } }) {
  return info.sort((a, b) => {
    return b.nota - a.nota;
  });
}
export function sortById(info) {
  return info.sort((a, b) => {
    return a.id - b.id;
  });
}

export function removeSpecialChars(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.]/g, "");
}

export function formatValue(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
