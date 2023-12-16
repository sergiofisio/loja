export function formatCpf(cpf: string) {
  cpf = cpf.replace(/\D/g, "");
  return cpf;
}

export function formatCep(cep: string) {
  cep = cep.replace(/\D/g, "");
  return cep;
}

export function formatPhone(phone: string) {
  phone = phone.replace(/\D/g, "");
  const formattedPhone = `(${phone.substr(0, 2)}) ${phone.substr(
    2,
    5
  )}-${phone.substr(7)}`;
  return formattedPhone;
}

export function sortByAverage({ data: { info } }: { data: { info: any } }) {
  return info.sort((a: any, b: any) => {
    return b.nota - a.nota;
  });
}
export function sortById(info: any) {
  return info.sort((a: any, b: any) => {
    return a.id - b.id;
  });
}

export function removeSpecialChars(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.]/g, "");
}

export function formatValue(value: number) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
