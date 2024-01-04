import arrow from "../../assets/button/arrow.svg";
import cart from "../../assets/button/cart.svg";
import { CircleLoader } from "react-spinners";
export default function Button({
  onClick,
  type,
  className,
  text,
  ...inputProps
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`${className} flex items-center justify-center w-full text-white font-special font-medium gap-4`}
      {...inputProps}
    >
      {(text === "Adicionar" ||
        text === "Ir as compras" ||
        text === "Finalizar") && (
        <>
          <img src={cart} alt="iconCart" />
        </>
      )}
      {inputProps.disabled ? <CircleLoader color="#fff" /> : text}
      {!inputProps.disabled && (text === "Cadastrar" || text === "Próximo") && (
        <>
          <img src={arrow} alt="iconArrow" />
        </>
      )}
    </button>
  );
}
