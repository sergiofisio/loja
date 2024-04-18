import { formatValue } from "../../functions/functions";
import Seller from "../products";
import { PulseLoader } from "react-spinners";

export default function Sellers({ products }) {
  return (
    <section className="flex flex-col gap-20 px-32 h-full md:px-8">
      {!products ? (
        <div>
          <PulseLoader color="#000" />
          <h2 className="text-purpleDark text-subTitle">Carregando</h2>
        </div>
      ) : (
        <>
          <h1 className="text-[#253d4e] font-main text-5xl font-semibold md:text-2xl">
            Alguns dos nossos produtos
          </h1>
          <div className="flex justify-around w-full md:overflow-y-auto md:justify-start">
            {products.length
              ? products.slice(0, 4).map((info) => {
                  return (
                    <div className="min-h-full flex" key={info.id}>
                      <Seller
                        img={info.image}
                        name={info.name}
                        priceFull={formatValue(info.price / 100)}
                        stock={info.stock}
                      />
                    </div>
                  );
                })
              : ""}
          </div>
        </>
      )}
    </section>
  );
}
