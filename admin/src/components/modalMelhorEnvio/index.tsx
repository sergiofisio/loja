import { NumberFormatValues, NumericFormat } from "react-number-format";
import closeBtn from "../../assets/closeBtn.svg";
import logo from "../../assets/melhor.svg";
import { useState } from "react";
import Button from "../button";
import axios from "../../Service/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ModalMelhorEnvio({
  setShowModal,
}: {
  setShowModal: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [value, setValue] = useState("");

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await axios.post(
        "/balance",
        {
          redirect: window.location.href,
          value,
        },
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
          },
        }
      );
    } catch (error: any) {
      console.error(error);
    }
  }
  return (
    <div className="flex flex-col justify-center items-center bg-bgModal fixed top-0 left-0 w-full h-full z-50">
      <div
        className={`relative flex flex-col items-center justify-evenly w-1/2 h-[50%] bg-white rounded-3xl px-12 py-8 shadow-green shadow-2xl  gap-4`}
      >
        <img
          onClick={() => {
            setShowModal("");
          }}
          className="absolute top-6 right-6 cursor-pointer"
          src={closeBtn}
          alt="btnClose"
        />
        <img src={logo} alt="LOGO MELHOR ENVIO" />
        <div className=" h-full flex flex-col items-center">
          <label className="capitalize font-bold text-xl">
            Valor de recarga
          </label>
          <NumericFormat
            className={`flex items-center h-12 rounded-xl py-1 px-3 border-[#555555] border-solid border-2 text-black`}
            value={value}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            onValueChange={(values: NumberFormatValues) =>
              setValue(values.value)
            }
            placeholder="$0,00"
            defaultValue="0,00"
          />
        </div>
        <Button
          type="submit"
          className="bg-green w-fit p-3 rounded-3xl border-2 border-solid border-green transition-all duration-500 hover:bg-white hover:text-green cursor-pointer"
          text="Recarregar"
          onClick={handleClick}
        />
      </div>
    </div>
  );
}
