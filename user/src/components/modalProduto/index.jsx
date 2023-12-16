import closeBtn from "../../assets/closeBtn.svg";
import { formatValue } from "../../functions/functions";
import Button from "../button";

export default function ModalProdutos({
  produto,
  setModalProduto,
  handleAddProduct,
}) {
  const { nome, preco, url, descricao, fabricante } = produto;

  const paragrafos = descricao.split(".");

  return (
    <div className="reflex flex-col justify-center items-center bg-bgModal fixed top-0 w-full h-full z-50">
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
              {nome}
            </h2>
            <h2 className="text-[#737380] font-normal font-secondary text-sm uppercase">
              {`Fabricante: ${fabricante}`}
            </h2>
          </div>
          <div className="flex flex-col h-full">
            <img
              className=" border-2 border-green rounded-3xl border-solid py-12 w-full h-full p-28"
              src={url}
              alt=""
            />
            <h2 className="flex justify-center items-center gap-2 text-black font-main font-bold text-2xl uppercase w-full h-full">
              Preço: <span className="text-green">{formatValue(preco)}</span>
            </h2>
          </div>
        </div>
        <div className="flex items-center justify-center border-solid border-green border-[1px] rounded-full h-2/3"></div>
        <div className="flex flex-col justify-between w-full h-full text-3xl font-bold">
          <div className="flex flex-col gap-2">
            {nome}
            {paragrafos.map((paragrafo, key) => {
              return (
                <p
                  key={key}
                  className="font-main text-[#737380] text-sm font-medium"
                >
                  {paragrafo}.
                </p>
              );
            })}
          </div>

          <Button
            onClick={e => handleAddProduct(e, produto)}
            type="button"
            className={"bg-green h-20 rounded-r-2xl rounded-bl-3xl"}
            text="Adicionar"
          />
        </div>
      </div>
    </div>
  );
}
