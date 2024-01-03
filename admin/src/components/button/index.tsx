import arrow from "../../assets/button/arrow.svg";
import cart from "../../assets/button/cart.svg";
export default function Button({
  onClick,
  type,
  className,
  text,
  disabled,
  ...inputProps
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type: "button" | "submit" | "reset";
  className: string;
  text: string;
  disabled?: boolean;
  inputProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`${className} flex items-center justify-center text-white font-special font-medium cursor-pointer gap-4`}
      disabled={disabled}
      {...inputProps}
    >
      {(text === "Adicionar" ||
        text === "Ir as compras" ||
        text === "Finalizar") && (
        <>
          <img src={cart} alt="iconCart" />
        </>
      )}
      {text}
      {(text === "Cadastrar" || text === "Próximo") && (
        <>
          <img src={arrow} alt="iconArrow" />
        </>
      )}
    </button>
  );
}
