import { useState } from "react";
// import axios from "../../Service/api";
// import { sortByAverage, sortById } from "../../functions/functions";
import { ProductsByCategories } from "../productsByCategories";

export default function Categories({
  setSelectCategory,
  selectCategory,
  categories,
  products,
}) {
  const [productsCategory, setProductsCategory] = useState(products);
  async function hangleChangeCategories(e, category) {
    e.preventDefault();
    e.stopPropagation();
    if (category === "Todas") {
      setSelectCategory(category);
      return setProductsCategory(products);
    }
    setSelectCategory(category.name);
    try {
      setProductsCategory(
        products.filter((product) => {
          return product.categoria === selectCategory;
        })
      );
      // console.log(products);
      // if (!products.data.length) {
      //   return setProductsCategory(products);
      // }
      // const sortProducts = sortById(products);
      // return setProductsCategory(sortProducts);
    } catch (error) {
      return console.error(error);
    }
  }

  return (
    <section className="flex flex-col mt-[5%] w-full px-32">
      <h1 className="mb-[2%]">Por categoria</h1>
      <div className="flex justify-end gap-[1%] pr-[2%] h-full font-main text-xl font-medium mb-[2%]">
        <h2
          className={`cursor-pointer ${
            selectCategory === "Todas" ? "text-green" : "text-[#253d4e]"
          }`}
          onClick={(e) => hangleChangeCategories(e, "Todas")}
        >
          Todas
        </h2>
        {categories.length
          ? categories.map((category, key) => {
              return (
                <div className="" key={key}>
                  <h2
                    className={`font-main text-xl font-medium cursor-pointer ${
                      selectCategory === category.name
                        ? "text-green"
                        : "text-[#253d4e]"
                    }
                    `}
                    onClick={(e) => hangleChangeCategories(e, category)}
                  >
                    {category.name}
                  </h2>
                </div>
              );
            })
          : ""}
      </div>
      <div className="mb-[2%] w-full flex items-center justify-center gap-12">
        {productsCategory.length ? (
          productsCategory.slice(0, 5).map((product) => {
            return (
              <div key={product.id}>
                <ProductsByCategories
                  img={product.images[0].url}
                  name={product.name}
                />
              </div>
            );
          })
        ) : (
          <>
            <h2 className="text-center w-full min-h-[14rem] text-5xl">
              Não há produtos nesta categoria por enquanto.
            </h2>
          </>
        )}
      </div>
    </section>
  );
}
