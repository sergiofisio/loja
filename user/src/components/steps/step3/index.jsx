import pointer from "../../../assets/cart/pointer.svg";
import truck from "../../../assets/cart/truck.svg";

export default function Step3({ adressUser, selectedOption, freteValue }) {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex w-full">
        <div className="flex w-full gap-5">
          <img className="w-10" src={pointer} alt="icon pointer" />
          <div>
            <h2 className="font-main text-base font-semibold t-[#253D4E]">{`${adressUser.city}, ${adressUser.state}`}</h2>
            <h2 className="font-main text-base font-semibold t-[#253D4E]">{`${
              adressUser.line_1
            }${adressUser.line_2 ? `-${adressUser.line_2}` : ""}`}</h2>
            <h2 className="font-main text-base font-semibold t-[#253D4E]">{`${adressUser.zip_code.slice(
              0,
              5
            )}-${adressUser.zip_code.slice(6)}`}</h2>
          </div>
        </div>
        <div className="flex w-2/4 gap-5">
          <img className="w-10" src={truck} alt="img truck" />
          <div className="flex flex-col font-main text-base font-medium">
            <h2 className="font-main text-base font-semibold t-[#253D4E]">{`${selectedOption}`}</h2>
            <h2 className="font-main text-base font-semibold t-[#253D4E]">
              {selectedOption === "Sedex"
                ? `R$ ${(freteValue.sedex.price * 1.2).toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}`
                : (freteValue.pac.price * 1.2).toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
