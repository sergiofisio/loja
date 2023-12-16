import { useEffect, useState } from "react";
import { formatValue } from "../../functions/functions";
import Seller from "../products";
import { PulseLoader } from "react-spinners";

export default function Sellers({ products }) {
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    setAllProducts(products);
  }, []);
  return (
    <section className="flex flex-col gap-20 px-32">
      {!allProducts ? (
        <div>
          <PulseLoader color="#000" />
          <h2 className="text-purpleDark text-subTitle">Carregando</h2>
        </div>
      ) : (
        <>
          <h1 className="text-[#253d4e] font-main text-5xl font-semibold">
            Alguns dos nossos produtos
          </h1>
          <div className="flex items-center justify-around w-full">
            {products.length
              ? products.slice(0, 4).map((info) => {
                  return (
                    <div key={info.id}>
                      <Seller
                        img={info.images[0].url}
                        name={info.name}
                        priceFull={formatValue(info.price)}
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
