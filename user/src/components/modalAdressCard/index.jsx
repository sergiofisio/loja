import Input from "../input/form/input";
import { verifyInputs } from "../../functions/errorTreatment";
import Button from "../button";
import axiosPrivate from "../../Service/api";
import { useEffect, useState } from "react";
import closeBtn from "../../assets/closeBtn.svg";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toastSuccess } from "../../context/toast";

export default function ModalAdressCard({ type, setShowModal, adressUser }) {
  const [adress, setAdress] = useState({
    street: "",
    number: "",
    neighborhood: "",
    complement: "",
    city: "",
    state: "",
    country: "BR",
    zip_code: "",
  });

  async function getAdressViaCep(cep) {
    if (!cep.includes("_") && cep.length === 9) {
      try {
        const {
          data: { logradouro, bairro, localidade, uf },
        } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        setAdress({
          ...adress,
          street: logradouro,
          neighborhood: bairro,
          city: localidade,
          state: uf,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function handleSendAdress(e) {
    e.preventDefault();
    e.stopPropagation();

    if (
      verifyInputs({
        Cep: adress.zip_code,
        Logradouro: adress.street,
        Número: adress.number,
        Bairro: adress.neighborhood,
        Cidade: adress.city,
        Estado: adress.state,
        Pais: adress.country,
      })
    )
      return;

    try {
      if (type === "editar") {
        await axiosPrivate.delete(
          `/deleteAdress/${await AsyncStorage.getItem("usuarioId")}`,
          {
            headers: {
              Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
            },
          }
        );
      }
      await axiosPrivate.post(
        `/adress/${await AsyncStorage.getItem("usuarioId")}`,
        {
          line_1: `${adress.number},${adress.street},${adress.neighborhood}`,
          line_2: adress.complement,
          city: adress.city,
          state: adress.state,
          country: adress.country,
          zip_code: adress.zip_code,
        },
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
          },
        }
      );

      toastSuccess(
        `Endereço ${type === "editar" ? "editado" : "cadastrado"} com sucesso!`,
        3000,
        "top-left"
      );
      setTimeout(() => {
        setShowModal("");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (type === "editar") {
      setAdress({
        street: adressUser.line_1.split(",")[1],
        number: adressUser.line_1.split(",")[0],
        neighborhood: adressUser.line_1.split(",")[2],
        complement: adressUser.line_2,
        city: adressUser.city,
        state: adressUser.state,
        country: "BR",
        zip_code: adressUser.zip_code,
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-center bg-bgModal absolute top-0 w-full h-full z-50 p-10 md:p-2 md:fixed">
      <div
        className={`relative flex flex-col justify-evenly w-1/3 ${
          type === "Endereço" ? "h-2/4" : "h-3/5"
        } h-2/4 bg-white rounded-3xl p-8 1536:h-4/5 1440:h-2/3 1366:h-5/6 1366:w-1/2 md:w-full md:h-full md:p-3`}
      >
        <img
          onClick={() => {
            setShowModal("");
          }}
          className="absolute top-6 right-6 cursor-pointer"
          src={closeBtn}
          alt="btnClose"
        />
        <h2 className="text-[#253D4E] font-main text-4xl font-semibold md:text-center capitalize">
          {type}
        </h2>
        <form className="flex flex-col items-center justify-between h-full md:justify-center md:gap-5">
          <div>
            <div className="w-full flex items-end gap-4">
              <Input
                label="Cep"
                type="text"
                placeholder="00000-000"
                set={(e) => {
                  setAdress({ ...adress, zip_code: e.target.value });
                }}
                value={adress.zip_code}
              />
              <Button
                onClick={() => getAdressViaCep(adress.zip_code)}
                className="bg-green rounded-3xl w-full p-2"
                text="Preencher endereço com CEP"
                type="button"
              />
            </div>
            <div className="flex gap-6">
              <Input
                label="Logradouro"
                type="text"
                placeholder="Digite seu endereço"
                set={(e) => {
                  setAdress({ ...adress, street: e.target.value });
                }}
                value={adress.street}
                className="w-3/4"
              />
              <Input
                label="Número"
                type="text"
                placeholder="Número"
                set={(e) => {
                  setAdress({ ...adress, number: e.target.value });
                }}
                value={adress.number}
                className="w-1/4"
              />
            </div>
            <div className="flex gap-6">
              <Input
                label="Complemento"
                type="text"
                placeholder="Complemento"
                set={(e) => {
                  setAdress({ ...adress, complement: e.target.value });
                }}
                value={adress.complement}
              />
              <Input
                label="Bairro"
                type="text"
                placeholder="Bairro"
                set={(e) => {
                  setAdress({ ...adress, neighborhood: e.target.value });
                }}
                value={adress.neighborhood}
              />
            </div>
            <div className="flex gap-6">
              <Input
                label="Cidade"
                type="text"
                placeholder="Cidade"
                set={(e) => {
                  setAdress({ ...adress, city: e.target.value });
                }}
                value={adress.city}
                className="w-1/2"
              />
              <Input
                label="Estado"
                type="text"
                placeholder="Estado"
                set={(e) => {
                  setAdress({ ...adress, state: e.target.value });
                }}
                value={adress.state}
                maxLength={2}
                className="w-1/4"
              />
              <Input
                label="Pais"
                type="text"
                placeholder="Pais"
                set={(e) => {
                  setAdress({ ...adress, country: e.target.value });
                }}
                value={adress.country}
                maxLength={2}
                className="w-1/4"
              />
            </div>
          </div>
          <div className="flex items-center justify-center w-1/3">
            <Button
              onClick={(e) => {
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
