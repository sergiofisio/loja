import closeBtn from "../../assets/closeBtn.svg";
import { formatValue } from "../../functions/functions";
import Button from "../button";

export default function ModalProdutos({
  produto,
  setModalProduto,
  handleAddProduct,
}) {
  console.log({ produto });
  return (
    <div className="flex flex-col justify-center items-center bg-bgModal fixed top-0 w-full h-full z-50">
      <div
        className={`relative flex items-center justify-evenly w-2/3 h-[90%] bg-white rounded-3xl px-12 py-8 shadow-green shadow-2xl  gap-4`}
      >
        <img
          onClick={() => {
            setModalProduto("");
          }}
          className="absolute top-6 right-6 cursor-pointer"
          src={closeBtn}
          alt="btnClose"
        />
        <div className="flex flex-col w-full h-full gap-12">
          <div className="flex flex-col gap-3">
            <h2 className="text-green font-bold font-main text-3xl uppercase">
              {produto.name}
            </h2>
          </div>
          <div className="flex flex-col h-full">
            <img
              className=" border-2 border-green rounded-3xl border-solid py-12 w-96 p-28"
              src={produto.image}
              alt=""
            />
            <h2 className="flex justify-center items-center gap-2 text-black font-main font-bold text-2xl uppercase w-full h-full">
              Preço: <span className="text-green">{formatValue(produto.promotion ? produto.promotionPrice / 100 : produto.price / 100)}</span>
            </h2>
          </div>
        </div>
        <div className="flex items-center justify-center border-solid border-green border-[1px] rounded-full h-2/3"></div>
        <div className="flex flex-col justify-evenly w-full h-full text-3xl ">
          <div className="flex flex-col justify-evenly items-center gap-4 h-3/4">
            <h2 className="font-bold">{produto.name}</h2>
            <div className="overflow-y-scroll h-full ">
              {produto.description.split("\n").map((paragraph, key) => {
                return <p className="text-base" key={key}>{paragraph}</p>
              })}
            </div>
          </div>

          <Button
            onClick={e => handleAddProduct(e, produto)}
            type="button"
            className={"bg-green min-h-[5rem] rounded-r-2xl rounded-bl-3xl"}
            text="Adicionar"
          />
        </div>
      </div>
    </div>
  );
}
