import Input from "../input/form/input";
import Button from "../button";
import axiosPrivate from "../../Service/api";
import { verifyInputs } from "../../functions/errorTreatment";
import { localconfig } from "../../utils/localConfig";
import { useEffect, useState } from "react";
import visa from "../../assets/payment/Visa.svg";
import master from "../../assets/payment/Mastercard.svg";
import elo from "../../assets/payment/Elo.svg";
import moment from "moment";
import SelectNumber from "../input/selectNumber";
import { toastFail } from "../../context/toast";
import validator from "validator";
import closeBtn from "../../assets/closeBtn.svg";

export default function ModalAdressCard({
  type,
  setShowModal,
  idPagarMe,
  setIdEnderecoPagar,
  rua,
  setRua,
  numero,
  setNumero,
  complemento,
  setComplemento,
  bairro,
  setBairro,
  cep,
  setCep,
  cidade,
  setCidade,
  estado,
  setEstado,
  pais,
  setPais,
}) {
  const [holder_name, setHolder_name] = useState("");
  const [number, setNumber] = useState("");
  const [exp_month, setExp_month] = useState("");
  const [exp_year, setExp_year] = useState("");
  const [cvv, setCvv] = useState("");
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState("");
  const [months, setMonths] = useState("");

  async function getAdressViaCep(cep) {
    if (!cep.includes("_") && !rua) {
      try {
        const {
          data: { logradouro, bairro, localidade, uf },
        } = await axiosPrivate.post("/correios", {
          cep,
        });
        setRua(logradouro);
        setBairro(bairro);
        setCidade(localidade);
        setEstado(uf);
        setPais("br");
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function handleSendAdress(e) {
    e.preventDefault();
    e.stopPropagation();

    verifyInputs({
      Cep: cep,
      Logradouro: rua,
      Número: numero,
      Bairro: bairro,
      Cidade: cidade,
      Estado: estado,
      Pais: pais,
    });

    try {
      const {
        data: { id },
      } = await axiosPrivate.post(
        "/registerAdress",
        {
          id: localStorage.getItem("usuarioId"),
          idPagarMe,
          endereco: `${rua}, ${numero}, ${bairro}`,
          complemento,
          cep,
          cidade,
          estado,
          pais,
        },
        localconfig.getAuth(localStorage.getItem("token"))
      );
      setIdEnderecoPagar(id);
      setShowModal("");
    } catch (error) {
      console.log(error);
    }
  }

  function getData() {
    const currentYear = parseInt(moment().format("YY"));
    const arrayYear = [];
    const arrayMonths = [];

    for (let i = currentYear; i < currentYear + 20; i++) {
      arrayYear.push(i);
    }

    for (let i = 1; i <= 12; i++) {
      arrayMonths.push(i);
    }
    setMonths(arrayMonths);
    setYear(arrayYear);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center bg-bgModal absolute top-0 w-full h-full">
      <div
        className={`relative flex flex-col justify-evenly w-1/3 ${
          type === "Endereço" ? "h-2/4" : "h-3/5"
        } h-2/4 bg-white rounded-3xl p-8 1536:h-4/5 1440:h-2/3 1366:h-5/6 1366:w-1/2`}
      >
        <img
          onClick={() => {
            setShowModal("");
          }}
          className="absolute top-6 right-6 cursor-pointer"
          src={closeBtn}
          alt="btnClose"
        />
        <h2 className="text-[#253D4E] font-main text-4xl font-semibold ">
          {type}
        </h2>
        <form className="flex flex-col items-center justify-between h-full">
          <div>
            {type === "Endereço" ? (
              <>
                <div className="w-1/3">
                  <Input
                    label="Cep"
                    type="text"
                    placeholder="00000-000"
                    set={setCep}
                    value={cep}
                    onBlur={getAdressViaCep(cep)}
                  />
                </div>
                <div className="flex gap-6">
                  <Input
                    label="Logradouro"
                    type="text"
                    placeholder="Digite seu endereço"
                    set={setRua}
                    value={rua}
                    className="w-3/4"
                  />
                  <Input
                    label="Número"
                    type="number"
                    placeholder="Número"
                    set={setNumero}
                    value={numero}
                    className="w-1/4"
                  />
                </div>
                <div className="flex gap-6">
                  <Input
                    label="Complemento"
                    type="text"
                    placeholder="Complemento"
                    set={setComplemento}
                    value={complemento}
                  />
                  <Input
                    label="Bairro"
                    type="text"
                    placeholder="Bairro"
                    set={setBairro}
                    value={bairro}
                  />
                </div>
                <div className="flex gap-6">
                  <Input
                    label="Cidade"
                    type="text"
                    placeholder="Cidade"
                    set={setCidade}
                    value={cidade}
                    className="w-1/2"
                  />
                  <Input
                    label="Estado"
                    type="text"
                    placeholder="Estado"
                    set={setEstado}
                    value={estado}
                    maxLength={2}
                    className="w-1/4"
                  />
                  <Input
                    label="Pais"
                    type="text"
                    placeholder="Pais"
                    set={setPais}
                    value={pais}
                    maxLength={2}
                    className="w-1/4"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="relative w-full">
                  <h1 className="text-[#253D4E] font-main text-2xl font-semibold">
                    Escolha a bandeira do cartão:
                  </h1>
                  <div
                    className={`absolute ${
                      brand ? "opacity-100" : "opacity-0"
                    } ${
                      brand === "MasterCard"
                        ? "left-[36%]"
                        : brand === "Elo"
                        ? "left-[74%]"
                        : "left-0"
                    } top-8  h-16 w-24 border-2 bg-green bg-opacity-30 rounded-3xl transition-all`}
                  ></div>
                  <div className=" flex justify-between w-full h-full">
                    <div className="flex h-16 z-20">
                      <input
                        className="hidden"
                        type="radio"
                        name="bandeira"
                        value="Visa"
                        id="visa"
                        checked={brand === "Visa"}
                        onChange={e => {
                          setBrand(e.target.value);
                        }}
                      />
                      <label
                        className="cursor-pointer"
                        onClick={e => {
                          e, setBrand("Visa");
                        }}
                        htmlFor="visa"
                      >
                        <img src={visa} alt="Visa" />
                      </label>
                    </div>
                    <div className="flex h-16 z-20">
                      <input
                        className="hidden"
                        type="radio"
                        name="bandeira"
                        value="MasterCard"
                        id="mastercard"
                        checked={brand === "MasterCard"}
                        onChange={e => {
                          setBrand(e.target.value);
                        }}
                      />
                      <label
                        className="cursor-pointer"
                        onClick={e => {
                          e, setBrand("MasterCard");
                        }}
                        htmlFor="mastercard"
                      >
                        <img src={master} alt="MasterCard" />
                      </label>
                    </div>
                    <div className="flex h-16 z-20">
                      <input
                        className="hidden"
                        type="radio"
                        name="bandeira"
                        value="Elo"
                        id="amex"
                        checked={brand === "Elo"}
                        onChange={e => {
                          setBrand(e.target.value);
                        }}
                      />
                      <label
                        className="cursor-pointer"
                        onClick={e => {
                          e, setBrand("Elo");
                        }}
                        htmlFor="elo"
                      >
                        <img src={elo} alt="elo" />
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <Input
                    className={"text-xl"}
                    label="Nome no cartão"
                    type="text"
                    placeholder="Escreva exatamente como esta no cartão"
                    set={setHolder_name}
                    value={holder_name}
                    required={true}
                  />
                </div>
                <div>
                  <Input
                    className={"text-xl"}
                    label="numeração"
                    type="text"
                    placeholder="digite os 16 numeros aqui"
                    set={setNumber}
                    value={number}
                    required={true}
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col justify-center gap-1 font-main font-normal text-xl">
                    <label
                      className="flex flex-col items-center justify-center h-full text-[#3bb77e] "
                      htmlFor="exp_month"
                    >
                      Mês
                    </label>
                    {months.length && (
                      <SelectNumber
                        className="bg-green border border-green text-white text-xl rounded-lg focus:ring-white focus:border-white block w-20 p-2.5 cursor-pointer"
                        set={setExp_month}
                        array={months}
                        value={exp_month}
                      />
                    )}
                  </div>
                  <div className="flex flex-col justify-center gap-1 font-main text-base font-normal">
                    <label
                      className="flex flex-col items-center justify-center h-full text-[#3bb77e]"
                      htmlFor="exp_year"
                    >
                      Ano
                    </label>
                    {months.length && (
                      <SelectNumber
                        className="bg-green border border-green text-white text-xl rounded-lg focus:ring-white focus:border-white block w-20 p-2.5 cursor-pointer"
                        set={setExp_year}
                        array={year}
                        value={exp_year}
                      />
                    )}
                  </div>
                  <Input
                    className={"w-20"}
                    label="cvc"
                    type="number"
                    placeholder="000"
                    set={setCvv}
                    value={cvv}
                    maxLength={3}
                    required={true}
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex items-center justify-center w-1/3">
            <Button
              onClick={e => {
                handleSendAdress(e);
              }}
              type="submit"
              text="Enviar"
              className="bg-green w-40 h-10 rounded-3xl"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
