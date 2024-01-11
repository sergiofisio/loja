import { useEffect, useState } from "react";
import closeBtn from "../../assets/closeBtn.svg";
import Input from "../input/form/input";
import uploadProduct from "../../assets/uploadProduct.svg";
import Button from "../button";
import axios from "./../../Service/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toastSuccess } from "../../context/toast";
import { NumberFormatValues, NumericFormat } from "react-number-format";

type InfoProdutoType = {
  name: string;
  description: string;
  weight: number;
  price: number | string;
  category: number;
  image: string;
  stock: number;
  [key: string]: string | number;
};

export default function ModalAdminProduto({
  type,
  produto,
  setProduto,
  setShowModal,
}: {
  type: string;
  produto: any;
  setProduto: React.Dispatch<React.SetStateAction<any>>;
  setShowModal: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [infoProduto, setInfoProduto] = useState({
    name: produto.name || "",
    description: produto.description || "",
    weight: produto.weight || "",
    price: produto.price / 100 || "",
    category: produto.categoryId || "",
    image: produto.image || "",
    stock: produto.stock || "",
  } as InfoProdutoType);
  const [categories, setCategories] = useState([]);
  const [upload, setUpload] = useState<File | null>(null);

  async function uploadImg(e: any) {
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData();

    if (upload) {
      formData.append("file", upload);
    }
    const {
      data: { url },
    } = await axios.post("/upload", formData, {
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });

    setInfoProduto({
      ...infoProduto,
      image: url,
    });
  }

  async function getCategories() {
    const {
      data: { categories },
    } = await axios.get("/categories");
    setCategories(categories);
  }

  async function handleOnSubmit(e: any) {
    e.preventDefault();
    e.stopPropagation();
    for (const key in infoProduto) {
      console.log(infoProduto[key]);
    }

    await axios[type === "create" ? "post" : "patch"](
      `/${type === "create" ? "createProduct" : `uploadProduct/${produto.id}`}`,
      { ...infoProduto, price: Number(infoProduto.price) * 100 },
      {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      }
    );

    toastSuccess(
      `Produto ${type === "create" ? "criado" : "editado"} com sucesso`,
      3000,
      "top-left"
    );
    setTimeout(() => {
      setProduto({
        name: "",
        description: "",
        weight: "",
        price: "",
        category: "",
        image: "",
        stock: "",
      });
      setShowModal("");
    }, 3000);
  }

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center bg-bgModal fixed top-0 left-0 w-full h-full z-50">
      <div
        className={`relative flex flex-col items-center justify-evenly w-2/3 h-[90%] bg-white rounded-3xl px-12 py-8 shadow-green shadow-2xl  gap-4`}
      >
        <img
          onClick={() => {
            setProduto({
              name: "",
              description: "",
              weight: "",
              price: "",
              category: "",
              image: "",
              stock: "",
            });
            setShowModal("");
          }}
          className="absolute top-6 right-6 cursor-pointer"
          src={closeBtn}
          alt="btnClose"
        />
        <h2>{produto ? "Editar Produto" : "Novo Produto"}</h2>
        <form className="flex  items-center w-full h-full" action="submit">
          <img
            className="w-1/3"
            src={infoProduto.image || uploadProduct}
            alt=""
          />
          <div className="flex flex-col items-center justify-around w-full h-full">
            <div className="flex items-center justify-around w-full">
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files) {
                    setUpload(e.target.files[0]);
                  }
                }}
              />
              <Button
                onClick={uploadImg}
                type="button"
                className=" flex w-1/3 bg-green rounded-3xl"
                text="Enviar"
              />
            </div>
            <Input
              type="text"
              label="Nome do produto"
              placeholder="Nome do produto"
              set={(e) => {
                setInfoProduto({ ...infoProduto, name: e.target.value });
              }}
              value={infoProduto.name}
              required={true}
            />
            <div className="w-full">
              <label
                className="font-main font-normal text-[#3bb77e] "
                htmlFor="descricao"
              >
                Descrição
              </label>
              <textarea
                className="border-[#555555] border-solid border-2 w-full resize-none overflow-y-scroll  scrollbar-thin scrollbar-thumb-green rounded-xl py-1 px-3 text-black"
                cols={30}
                rows={8}
                onChange={(e) => {
                  setInfoProduto({
                    ...infoProduto,
                    description: e.target.value,
                  });
                }}
                value={infoProduto.description}
              />
            </div>
            <div className="flex items-center gap-5">
              <Input
                type="number"
                label="Peso(gramas)"
                placeholder="Peso"
                set={(e) => {
                  setInfoProduto({ ...infoProduto, weight: e.target.value });
                }}
                value={infoProduto.weight}
                required={true}
              />
              <div className="flex flex-col justify-center gap-1 font-main font-normal text-[#3bb77e] w-full text-base">
                <label className="capitalize">Preço</label>
                <NumericFormat
                  className={`flex items-center w-full h-12 rounded-xl py-1 px-3 border-[#555555] border-solid border-2 text-black`}
                  value={infoProduto.price}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  onValueChange={(values: NumberFormatValues) =>
                    setInfoProduto({
                      ...infoProduto,
                      price: values.value,
                    })
                  }
                  placeholder="$0,00"
                  defaultValue="0,00"
                />
              </div>
              <Input
                type="number"
                label="Estoque"
                placeholder="Estoque"
                set={(e) => {
                  if (e.target.value < 0) {
                    return;
                  }
                  setInfoProduto({ ...infoProduto, stock: e.target.value });
                }}
                value={infoProduto.stock}
                required={true}
                min={0}
              />
              <div className="w-full text-[#3bb77e]">
                <label htmlFor="categoryId">Categoria</label>
                <select
                  className="w-full h-full border-black border-2 rounded-3xl font-main text-base font-normal text-black focus:outline-none text-center"
                  value={infoProduto.category}
                  onChange={(e) => {
                    setInfoProduto({
                      ...infoProduto,
                      category: Number(e.target.value),
                    });
                  }}
                >
                  <option value=""></option>
                  {categories.map(
                    ({ name, id }: { name: string; id: number }) => {
                      return (
                        <option key={id} value={id} className="w-full">
                          {name}
                        </option>
                      );
                    }
                  )}
                </select>
              </div>
            </div>
            <Button
              onClick={handleOnSubmit}
              type="submit"
              className=" flex w-1/3 bg-green rounded-3xl"
              text="Enviar"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
