import { useState } from "react";
import InputMask from "react-input-mask";
import closedEye from "../../../assets/input/closedEye.svg";
import openedEye from "../../../assets/input/openedEye.svg";

export default function Input({
  password,
  error,
  label,
  type,
  placeholder,
  set,
  value,
  required,
  className,
  classnameLabel,
  maxLength,
  ...inputProps
}) {
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInput = (e) => {
    if (label === "cvc" && maxLength) {
      const inputValue = e.target.value;
      if (inputValue.length > maxLength) {
        e.target.value = inputValue.slice(0, maxLength);
      }
    }
    set(e.target.value);
  };

  const masks = {
    Cpf: "999.999.999-99",
    Telefone: "(99) 99999-9999",
    numeração: "9999 9999 9999 9999",
    Cep: "99999-999",
  };

  const commonClasses = `w-full ${
    inputProps.disabled ? "bg-gray-200 cursor-not-allowed" : "bg-white"
  } border-none font-main text-base font-normal text-black focus:outline-none text-center`;

  return (
    <div
      className={`flex flex-col justify-center gap-1 font-main font-normal text-[#3bb77e] ${
        className || "w-full text-base"
      }`}
    >
      <label className={`capitalize ${classnameLabel}`} htmlFor={label}>
        {label}
      </label>
      <div
        className={`relative flex items-center w-full h-12 rounded-xl py-1 px-3 ${
          inputProps.disabled ? "bg-gray-200 cursor-not-allowed" : "bg-white"
        } border-[#555555] border-solid border-2 ${error ? " erro" : ""}`}
      >
        <InputMask
          className={`${commonClasses} placeholder:${
            label !== "E-mail" ? "capitalize" : ""
          }`}
          mask={masks[label] || ""}
          type={
            label === "Senha" || label === "Confirmar Senha"
              ? showPassword
                ? "text"
                : "password"
              : type
          }
          id={label}
          placeholder={placeholder}
          onChange={set}
          maxLength={maxLength}
          value={value}
          {...inputProps}
        />
        {password && (
          <img
            src={showPassword ? openedEye : closedEye}
            className={`absolute right-2 top-auto cursor-pointer ${
              showPassword ? "" : "olho-fechado"
            }`}
            onClick={handleShowPassword}
            alt="ícone que habilita visibilidade da senha."
          />
        )}
      </div>
    </div>
  );
}
